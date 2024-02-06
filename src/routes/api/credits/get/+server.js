import OpenAI from 'openai'
import { SECRET_EMAIL, SECRET_PASSWORD } from '$env/static/private'

export async function GET({request}) {
    return Response.json({credits_remaining: 50});
}