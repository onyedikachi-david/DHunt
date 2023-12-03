import { ethers } from "hardhat";

// Import types
import type { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import type { AddressLike, BigNumberish } from "ethers";
import type { DHunt } from "@typechain/contracts";

// CONSTANT, TYPES AND UTILS
//======================================================

export type DHuntArgs = {
    proofOfIdentityAddress: AddressLike;
};

// error DHunt__Suspended();
// error DHunt__NoIdentityNFT();
// error DHunt__ZeroAddress();

type IdErrorKey = keyof typeof DHUNT_ERRORS;

const DHUNT_ERRORS = {
    SUSPENDED: "DHunt__Suspended",
    NO_ID: "DHunt_NoIdentityNFT",
    ZERO_ADDRESS: "DHunt_ZeroAddress",
} as const satisfies Record<string, string>;

export function dHuntError(err: IdErrorKey): string {
    return DHUNT_ERRORS[err];
}

export class DHuntTest {
    // vars
    private _isInitialized: boolean;

    private _foundation!: HardhatEthersSigner;
    private _foundationAddress!: string;

    private _accounts!: HardhatEthersSigner[];
    private _accountAddresses!: string[];

    private _dhuntContract!: DHunt;
    private _dHuntContractAddress!: string;
    private _dHuntArgs!: DHuntArgs;

    private constructor() {
        this._accounts = [];
        this._accountAddresses = [];
        this._isInitialized = false;
    }

    private async init(poiAddress: AddressLike): Promise<DHuntTest> {
        // Accounts
        const [foundation, ...rest] = await ethers.getSigners();

        this._foundation = foundation;
        this._foundationAddress = await foundation.getAddress();

        for (let i = 0; i < rest.length; ++i) {
            this._accounts.push(rest[i]);
            this._accountAddresses.push(await rest[i].getAddress());
        }

        this._dHuntArgs = {
            proofOfIdentityAddress: poiAddress,
        };

        this._dhuntContract = await this.deployDHunt(this._dHuntArgs);

        this._dHuntContractAddress = await this._dhuntContract.getAddress();

        this._isInitialized = true;
        return this;
    }

    public static async create(poiAddress: AddressLike): Promise<DHuntTest> {
        const instance = new DHuntTest();
        return await instance.init(poiAddress);
    }

    public async deployDHunt(args: DHuntArgs): Promise<DHunt> {
        const f = await ethers.getContractFactory("DHunt");
        const c = await f.deploy(args.proofOfIdentityAddress);

        return await c.waitForDeployment();
    }

    public get foundation(): HardhatEthersSigner {
        this.validateInitialized("foundation");
        return this._foundation;
    }

    public get foundationAddress(): string {
        this.validateInitialized("foundationAddress");
        return this._foundationAddress;
    }

    public get dHuntContractAddress(): string {
        this.validateInitialized("dHuntContractAddress");
        return this._dHuntContractAddress;
    }

    public get dhuntContract(): DHunt {
        this.validateInitialized("dhuntContract");
        return this._dhuntContract;
    }

    public get dHuntArgs(): DHuntArgs {
        this.validateInitialized("dHuntArgs");
        return this._dHuntArgs;
    }

    public get accounts(): HardhatEthersSigner[] {
        this.validateInitialized("accounts");
        return this._accounts;
    }

    public get accountAddresses(): string[] {
        this.validateInitialized("accountAddresses");
        return this._accountAddresses;
    }

    // Helpers
    private validateInitialized(method: string): void {
        if (!this._isInitialized) {
            throw new Error(
                `Deployment not initialized. Call create() before accessing ${method}.`
            );
        }
    }
}
