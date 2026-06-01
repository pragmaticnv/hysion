export async function generateMeshy3DModel(prompt: string, onProgress?: (progress: number) => void): Promise<{ glb: string }> {
  try {
    const response = await fetch('/api/generate-3d', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to start Generation');
    }

    const { taskId } = await response.json();

    let status = "PENDING";
    let finalData = null;

    while (status === "PENDING" || status === "IN_PROGRESS") {
      const statusRes = await fetch(`/api/generate-3d/${taskId}`);
      if (!statusRes.ok) {
         const errorData = await statusRes.json().catch(() => ({}));
         throw new Error(errorData.error || 'Failed to check status');
      }
      
      const data = await statusRes.json();
      status = data.status;
      
      if (status === "SUCCEEDED") {
        finalData = data;
      } else if (status === "FAILED") {
        throw new Error(`Meshy Generation Failed: ${data.task_error?.message || 'Unknown error'}`);
      } else {
        if (onProgress) {
          onProgress(data.progress || 0);
        }
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    if (finalData && finalData.model_urls && finalData.model_urls.glb) {
      return { glb: finalData.model_urls.glb };
    } else {
       throw new Error("No GLB model returned from generation.");
    }
  } catch (error) {
    console.error("Error in generateMeshy3DModel:", error);
    throw error;
  }
}
