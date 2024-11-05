import pool from "../../../../db"

type Company = [number, string, string, string];

export async function GET(req: Request, { params }: { params: { ticker: string } }) {
    const ticker = params.ticker
    let data

    try {
        const response = await fetch("https://www.sec.gov/files/company_tickers_exchange.json", {
            headers: {
                "User-Agent": "Test (test@gmail.com)"
            }
        });
        data = await response.json()

    } catch (error) {
        return Response.json({ error: error }, { status: 500 })
    }

    const companies: Company[] = data.data
    const selectedCompany = companies.filter((company: Company) => company[2] == ticker)

    if (selectedCompany.length === 0) {
        return new Response(JSON.stringify({ error: "Company not found" }), { status: 404 });
    }
    await pool.query(
        `
        INSERT INTO companies_views (ticker, views)
        VALUES ($1, 1)
        ON CONFLICT (ticker)
        DO UPDATE SET views = companies_views.views + 1
        `,
        [ticker]
    );


    return Response.json(selectedCompany)
}