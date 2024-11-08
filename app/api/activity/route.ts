import pool from "../../../db"

interface Company {
    ticker: string,
    views: number
}

export async function GET() {
    let data: Company[]
    try {
        const result = await pool.query(
            `
            SELECT ticker, views
            FROM companies_views
            ORDER BY views DESC
            LIMIT 5
            `
        );
        data = result.rows;
    } catch (error) {
        console.log(error)
        return Response.json({ error: error }, { status: 500 })
    }
    const topViewed = data.map((company) => ({
        [company.ticker]: company.views
    }))
    return new Response(JSON.stringify(topViewed));
}