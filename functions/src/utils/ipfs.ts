import axios from "axios";

export const defaultIpfsGateway = "https://gateway.ipfscdn.io/ipfs/";

export const fixIpfsURL = (uri: string): string => {
  if (uri.startsWith("https://ipfs.moralis.io:2053/ipfs/")) {
    uri = uri.replace("https://ipfs.moralis.io:2053/ipfs/", "ipfs://");
  } else if (uri.startsWith("https://ipfs.io/ipfs/")) {
    uri = uri.replace("https://ipfs.io/ipfs/", "ipfs://");
  } else if (uri.match(/^[a-zA-Z0-9_]+$/)) {
    // uri is just ipfs cid
    uri = `ipfs://${uri}`;
  }
  return resolveIpfsUri(uri) || uri;
};

export function resolveIpfsUri(uri?: string | null): string | undefined {
  if (!uri) {
    return undefined;
  }
  if (uri.startsWith && uri.startsWith("ipfs://")) {
    return uri.replace("ipfs://", defaultIpfsGateway);
  }
  return uri;
}

export async function getTokenMetadata(tokenUri: string) {
  try {
    const fixedUrl = fixIpfsURL(tokenUri);
    const axiosData = await axios.get(fixedUrl);
    return axiosData.data;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.error("getTokenMetadata failed: ", tokenUri, e);
    }
    return null;
  }
}
