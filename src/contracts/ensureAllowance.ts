import BigNumber from 'bignumber.js';
import { BigNumber as EthersBigNumber, Contract } from 'ethers';
import waitForEvent from './waitForEvent';

type ApprovalParameters = {
  owner: string;
  spender: string;
  expense: BigNumber;
};

async function setAllowance(
  tokenContract: Contract,
  { owner, spender, expense }: ApprovalParameters,
) {
  const requiredAllowance = EthersBigNumber.from(expense.toFixed());
  await tokenContract.approve(spender, requiredAllowance);
  return Promise.race([
    waitForEvent(
      tokenContract,
      'Approval',
      (o: string, s: string) => o === owner && s === spender,
    ),
    new Promise<void>((resolve) => {
      const intervalDescriptor = setInterval(async () => {
        try {
          const allowance: EthersBigNumber = await tokenContract.allowance(
            owner,
            spender,
          );

          if (allowance.eq(requiredAllowance)) {
            clearInterval(intervalDescriptor);
            resolve();
          }
          // eslint-disable-next-line no-empty
        } catch { }
      }, 10000);
    }),
  ]);
}

export default async function ensureAllowance(
  tokenContract: Contract,
  { owner, spender, expense }: ApprovalParameters,
) {
  const requiredAllowance = EthersBigNumber.from(expense.toFixed());
  const currentAllowance: EthersBigNumber = await tokenContract.allowance(
    owner,
    spender,
  );

  if (!currentAllowance || currentAllowance.lt(requiredAllowance)) {
    try {
      await setAllowance(
        tokenContract,
        { owner, spender, expense },
      );
    } catch (e) {
      const isInternalError = e.code > 0;
      if (!isInternalError) {
        await setAllowance(
          tokenContract,
          { owner, spender, expense: new BigNumber(0) },
        );
        await setAllowance(
          tokenContract,
          { owner, spender, expense },
        );
      } else {
        throw e;
      }
    }
  }
}
