import { StringArrayFunction } from './types/StringArrayFunction';

type RC4Decoder = (index: number, key: string) => string;
type Base64Decoder = (index: number) => string;

export class StringsDecoder {
  private decoders: {
    [key: string]: Base64Decoder | RC4Decoder;
  } = {};
  constructor(
    private readonly array: string[],
    arrayFunctions: { [key: string]: StringArrayFunction },
  ) {
    for (const [name, arrayFunction] of Object.entries(arrayFunctions)) {
      switch (arrayFunction.encryption) {
        case 'base64': {
          this.decoders[name] = (index: number) => {
            return this.decodeBase64(array[index - arrayFunction.offset]);
          };
          continue;
        }
        case 'rc4': {
          this.decoders[name] = (index: number, key: string) => {
            return this.decodeRC4(array[index - arrayFunction.offset], key);
          };
          continue;
        }
        case 'none': {
          this.decoders[name] = (index: number) =>
            array[index - arrayFunction.offset];
          continue;
        }
      }
    }
  }

  public isDecoderFunction(name: string) {
    return Object.keys(this.decoders).includes(name);
  }

  public decode(functionName: string, index: number, key?: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.decoders[functionName](index, key!);
  }

  public rotateArray() {
    const shifted = this.array.shift();
    if (!shifted) {
      throw new Error('Unexpected string array value while rotating');
    }
    this.array.push(shifted);
  }

  private decodeBase64(
    input: string,
    alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=',
  ) {
    const parsedInput = input.replace(/=+$/, '');

    let output = '';
    let tempEncodedString = '';

    for (
      let bc = 0, bs = 0, buffer: string | number, idx = 0;
      (buffer = parsedInput.charAt(idx++));
      ~buffer &&
      ((bs = (bc % 4 ? bs * 64 + (buffer as number) : buffer) as number),
      bc++ % 4)
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      buffer = alphabet.indexOf(buffer as string);
    }

    for (let k = 0, length = output.length; k < length; k++) {
      tempEncodedString +=
        '%' + ('00' + output.charCodeAt(k).toString(16)).slice(-2);
    }

    return decodeURIComponent(tempEncodedString);
  }

  private decodeRC4(str: string, key: string) {
    const s: number[] = [];
    let x: number;
    let output = '';

    str = this.decodeBase64(str);

    for (let i = 0; i < 256; i++) {
      s[i] = i;
    }

    for (let i = 0, j = 0; i < 256; i++) {
      j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
    }

    for (let i = 0, j = 0, y = 0; y < str.length; y++) {
      i = (i + 1) % 256;
      j = (j + s[i]) % 256;
      x = s[i];
      s[i] = s[j];
      s[j] = x;
      output += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return output;
  }
}
