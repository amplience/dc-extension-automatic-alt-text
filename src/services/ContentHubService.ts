/* eslint-disable @typescript-eslint/no-explicit-any */
import { ContentFieldExtension } from "dc-extensions-sdk";
import { HttpMethod } from "dc-extensions-sdk/dist/types/lib/components/HttpClient";

export interface Asset {
  srcName: string;
  revisionNumber: number;
  bucketID: string;
  label: string;
  mimeType: string;
  type: string;
  userID: string;
  thumbFile: string;
  folderID: string;
  file: string;
  createdDate: number;
  name: string;
  subType: string | null;
  id: string;
  thumbURL: string;
  publishStatus: string;
  status: string;
  timestamp: number;
}

export default class ContentHubService {
  private basepath: string;

  constructor(
    private readonly sdk: ContentFieldExtension,
    private readonly hubId: string,
    options?: { basepath: string },
  ) {
    this.basepath =
      options?.basepath || "https://api.amplience.net/v2/content/media-library";
  }

  async getAssetById(id: string) {
    const paramsObj = { select: "meta:altText", variants: "*,en" };
    const searchParams = new URLSearchParams(paramsObj);
    try {
      const response = (await this.sdk.client.request({
        url: `${this.basepath}/${
          this.hubId
        }/assets/${id}?${searchParams.toString()}`,
        method: "GET" as HttpMethod.GET,
      })) as any;

      if (response?.status !== 200) {
        throw new Error("Error fetching asset");
      }

      if (!response.data?.content?.data?.[0]) {
        throw new Error("Unexpected API response");
      }

      return response.data.content.data[0];
    } catch (e) {
      console.error(`Failure during getAssetById: ${(e as Error).message}`);
      throw e;
    }
  }

  async getAssetAltTextById(id: string) {
    try {
      const asset = await this.getAssetById(id);
      const assetAltText =
        asset?.relationships?.hasAltText?.[0]?.variants?.[0].values;
      return {
        locales: assetAltText
          ? {
              default: assetAltText.defaultDescription,
              ...assetAltText.descriptions,
            }
          : {},
      };
    } catch (e) {
      console.error(
        `Failure during getAssetAltTextById: ${(e as Error).message}`,
      );
      throw e;
    }
  }
}
