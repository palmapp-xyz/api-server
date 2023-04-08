
export function lowercaseTheKeys(data: any): { [key: string]: any } {
  const dataV2 = {};
  Object.entries(data).forEach(([key, value]) => {
    const keyV2 = key.toLowerCase();
    // @ts-ignore
    dataV2[keyV2] = value;
  });
  return dataV2;
}


