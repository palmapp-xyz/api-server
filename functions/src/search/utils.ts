
export function lowercaseTheKeys(data: any): { [key: string]: any } {
  const dataV2 = {};
  Object.entries(data).forEach(([key, value]) => {
    const keyV2 = key.toLowerCase();
    // @ts-ignore
    dataV2[keyV2] = value;
  });
  return dataV2;
}

export function removeNoiseFromSearchResponse(response: any) {
  const {hits} = response.hits;
  const result = hits.map((hit) => {
    const {_index, _source} = hit;
    return {_index, _source};
  });
  return result;
}

export function removeNoiseFromSuggestionResponse(response: any) {
  const {options} = response.suggest.suggest_all[0];
  const result = options.map((option) => {
    const {text, _index, _source} = option;
    return {text, _index, _source};
  });
  return result;
}

export enum NetworkType {
  Mainnet = 'MAINNET',
  Testnet = 'TESTNET',
}
