import { httpClient, unwrap } from "./httpClient";

export async function submitFeedback(message: string): Promise<{ id: string; submittedAt: string }> {
  return unwrap<{ id: string; submittedAt: string }>(httpClient.post("/feedback", { message }));
}
