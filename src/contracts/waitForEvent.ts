import { Contract } from 'ethers';

export default function waitForEvent(
  contract: Contract,
  eventName: string,
  predicate: (...args: any[]) => boolean,
) {
  return new Promise<any[]>((resolve) => {
    const callback = (...args: any[]) => {
      if (predicate(...args)) {
        contract.removeListener(eventName, callback);
        resolve(args);
      }
    };
    contract.on(eventName, callback);
  });
}
