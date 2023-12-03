/* IMPORT NODE MODULES
================================================== */
import { upgrades } from "hardhat";

/* IMPORT TYPES
================================================== */
import type { BaseContract, ContractFactory } from "ethers";
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

/* UPGRADE PROXY
================================================== */
/**
 * Upgrades the deployed instance of `EscrowedH1` to a new version.
 *
 * # Error
 * Will throw an error if the upgrade is not successful. The calling code
 * must handle as desired.
 *
 * @async
 * @function    upgradeProofOfIdentity
 * @param       {string}                deployedContractAddress
 * @param       {ContractFactory}       newImpl
 * @returns     {Promise<T extends BaseContract>}   Promise that resolves to `ProofOfIdentity`
 * @throws
 */
export async function upgradeProofOfIdentity<T extends BaseContract>(
    deployedContractAddress: string,
    newImpl: ContractFactory,
    signer?: HardhatEthersSigner
): Promise<T> {
    let f = newImpl;

    if (signer) f = newImpl.connect(signer);

    const c = await upgrades.upgradeProxy(deployedContractAddress, f, {
        kind: "uups",
    });

    return (await c.waitForDeployment()) as unknown as T;
}
