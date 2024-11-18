import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.HOSTHIS_API_KEY;

  const { id } = params;
  const { email } = await req.json()

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: "Env variable not found" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.post(`${apiUrl}/V1/commands/project/${id}/status?`, {
      email: email
    }, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const containerData = response.data;

    return NextResponse.json(containerData, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Cannot fetch status" },
      { status: 400 }
    );
  }
}
