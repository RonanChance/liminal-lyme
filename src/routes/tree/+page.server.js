import PocketBase from 'pocketbase';
const pb = new PocketBase("https://data.liminallyme.com");

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        console.log(formData);

        const suggestion = formData.get('suggestion');
        const article_link = formData.get('article-link');
        const purchase_link = formData.get('purchase-link');
        const email = formData.get('email');

        const data = {
            "suggestion": suggestion || '',
            "article_link": article_link || '',
            "purchase_link": purchase_link || '',
            "email": email || ''
        };

        try {
            const record = await pb.collection('suggestions').create(data);
            return true
        }
        catch (error) {
            console.log(error);
            return false
        }
    }
}