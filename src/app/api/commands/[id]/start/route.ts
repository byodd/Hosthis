import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.HOSTHIS_API_KEY;
  
  const { id } = params;

  if (!apiUrl || !apiKey) {
    return NextResponse.json(
      { error: "Env variable not found" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { email } = body;

  try {
    const response = await axios.post(
      `${apiUrl}/V1/commands/${id}/start`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const containerData = response.data;
    console.log(containerData);

    return NextResponse.json(
      containerData,
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Cannot start container" },
      { status: 400 }
    );
  }
}
