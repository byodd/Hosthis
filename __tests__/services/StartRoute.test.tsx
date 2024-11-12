// StartRoute.test.tsx
import axios from "axios";
import { POST } from "@/app/api/commands/[id]/start/route";
import { NextRequest, NextResponse } from "next/server";

global.fetch = jest.fn();
global.Request = jest.fn().mockImplementation((url, init) => ({
  url,
  ...init,
}));

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("next/server", () => ({
  NextRequest: jest.fn().mockImplementation((url, init) => ({
    url,
    json: async () => (init?.body ? JSON.parse(init.body) : {}),
  })),
  NextResponse: {
    json: jest.fn().mockImplementation((body, init) => ({
      json: async () => body,
      status: init?.status || 200,
    })),
  },
}));

describe("Start Project Route", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      API_URL: "http://test-api.com",
      HOSTHIS_API_KEY: "test-key",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should start project successfully", async () => {
    const mockResponse = {
      container: {
        status: true,
        url: "https://test-project.com",
      },
    };
    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const request = new NextRequest(
      "http://localhost:3000/api/commands/123/start",
      {
        method: "POST",
        body: JSON.stringify({ email: "test@example.com" }),
      }
    );

    const response = await POST(request, { params: { id: "123" } });
    const data = await response.json();

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "http://test-api.com/V1/commands/123/start",
      { email: "test@example.com" },
      {
        headers: {
          Authorization: "Bearer test-key",
          "Content-Type": "application/json",
        },
      }
    );
    expect(data).toEqual(mockResponse);
  });
});
