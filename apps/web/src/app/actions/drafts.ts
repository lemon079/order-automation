"use server";

import {
  createClient,
  createServiceRoleClient,
} from "@repo/shared/supabase/server";
import { revalidatePath } from "next/cache";
import { CreateOrderInput, OrderDraft } from "@repo/shared";

/**
 * Fetch all pending order drafts
 */
export async function getPendingDrafts(): Promise<OrderDraft[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("order_drafts")
    .select(
      `
      *,
      call_transcripts (
        transcript,
        call_sid
      )
    `,
    )
    .in("status", ["pending", "pending_review"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching drafts:", error);
    return [];
  }

  // Transform data to match OrderDraft interface
  return data.map((draft: any) => ({
    ...draft,
    transcript_text: draft.call_transcripts?.transcript || "",
    source: draft.call_transcripts?.call_sid?.startsWith("whatsapp")
      ? "whatsapp"
      : "voice",
  }));
}

/**
 * Approve a draft and promote it to a real Order
 */
export async function approveDraft(
  draftId: string,
  orderData: CreateOrderInput,
) {
  console.log("[approveDraft] Starting approval for draft:", draftId);
  console.log("[approveDraft] Order data:", JSON.stringify(orderData, null, 2));

  // Use service role client to bypass RLS
  const supabase = createServiceRoleClient();

  // 1. Create the Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email,
      pickup_address: orderData.pickup_address,
      pickup_contact_name: orderData.pickup_contact_name,
      pickup_contact_phone: orderData.pickup_contact_phone,
      pickup_time_window_start: orderData.pickup_time_window_start,
      pickup_time_window_end: orderData.pickup_time_window_end,
      dropoff_address: orderData.dropoff_address,
      dropoff_contact_name: orderData.dropoff_contact_name,
      dropoff_contact_phone: orderData.dropoff_contact_phone,
      dropoff_time_window_start: orderData.dropoff_time_window_start,
      dropoff_time_window_end: orderData.dropoff_time_window_end,
      special_instructions: orderData.special_instructions,
      internal_notes: orderData.internal_notes,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) {
    console.error("[approveDraft] Error creating order:", orderError);
    return { success: false, error: orderError.message };
  }

  console.log("[approveDraft] Order created successfully:", order.id);

  // 2. Create Order Items
  if (orderData.items && orderData.items.length > 0) {
    const itemsToInsert = orderData.items.map((item) => ({
      order_id: order.id,
      name: item.name,
      quantity: item.quantity,
      weight: item.weight,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(itemsToInsert);

    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      // Ideally we should rollback here, but Supabase doesn't support easy multi-table transactions via client
      // We'll proceed to update draft but log the error
    }
  }

  // 3. Mark Draft as Approved
  const { error: updateError } = await supabase
    .from("order_drafts")
    .update({ status: "approved" })
    .eq("id", draftId);

  if (updateError) {
    console.error("Error updating draft status:", updateError);
  }

  revalidatePath("/drafts");
  revalidatePath("/orders");
  return { success: true, orderId: order.id };
}

/**
 * Reject/Archive a draft
 */
export async function rejectDraft(draftId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("order_drafts")
    .update({ status: "rejected" })
    .eq("id", draftId);

  if (error) {
    console.error("Error rejecting draft:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/drafts");
  return { success: true };
}
