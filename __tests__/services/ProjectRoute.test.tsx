import axios from "axios";
import { GET } from "@/app/api/projects/[userEmail]/route";
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

describe("Projects Route", () => {
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

  it("should get projects successfully", async () => {
    const mockProjects = [
      {
        id: "123",
        name: "test-project",
        status: "running",
      },
    ];
    mockedAxios.get.mockResolvedValue({ data: mockProjects });

    const request = new NextRequest(
      "http://localhost:3000/api/projects/test@example.com"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "http://test-api.com/V1/email/test@example.com/projects",
      {
        headers: {
          Authorization: "Bearer test-key",
        },
      }
    );
    expect(data).toEqual(mockProjects);
    expect(response.status).toBe(200);
  });

  it("should return 500 when env variables are missing", async () => {
    process.env.API_URL = undefined;
    process.env.HOSTHIS_API_KEY = undefined;

    const request = new NextRequest(
      "http://localhost:3000/api/projects/test@example.com"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({ error: "Env variable not found" });
    expect(response.status).toBe(500);
  });

  it("should handle API errors", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API Error"));
    console.error = jest.fn();

    const request = new NextRequest(
      "http://localhost:3000/api/projects/test@example.com"
    );

    const response = await GET(request);
    const data = await response.json();

    expect(data).toEqual({ message: "Cannot fetch API" });
    expect(response.status).toBe(400);
  });
});
