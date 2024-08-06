export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        console.log(formData);
    }
}