const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default {
  async getPdfsByCourse(courseId: string) {
    const response = await fetch(`${API_URL}/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    const data = await response.json();
    return data.data.pdfs;
  },

  async uploadPdf(courseId: string, formData: FormData) {
    await fetch(`${API_URL}/courses/${courseId}/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });
  },

  async updatePdf(pdfId: number, formData: FormData) {
    await fetch(`${API_URL}/pdfs/${pdfId}/update`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: formData
    });
  },

  async deletePdf(pdfId: number) {
    await fetch(`${API_URL}/pdfs/${pdfId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
  }
};