import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.HOSTHIS_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: "Env variable not found" },
      { status: 500 }
    );
  }
  const body = await req.json();

  try {
    const response = await axios.post(
      `${apiUrl}/V1/commands`,
      {
        ...body,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Cannot fetch API" }, { status: 400 });
  }
}
