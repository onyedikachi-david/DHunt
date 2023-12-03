import { expect } from "chai";
import {
    loadFixture,
    // time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import {
    ProofOfIdTest,
    // randIdArgs
} from "../setup";
import {
    DHuntTest,
    // dHuntError
} from "./setup";
// import { addTime } from "@utils/time";
import { ZERO_ADDRESS } from "../../constants";
// import {}

describe("DHunt", function () {
    // const exp = BigInt(addTime(Date.now(), 2, "months", "sec"));

    async function setup() {
        const poi = await ProofOfIdTest.create();
        const d = await DHuntTest.create(poi.proofOfIdContractAddress);
        return { poi, d };
    }

    // Deployment and initialization
    describe("Deployment and initialization", function () {
        it("Should have a deployment address", async function () {
            const { d } = await loadFixture(setup);

            expect(d.dHuntContractAddress).to.have.length(42);
            expect(d.dHuntContractAddress).to.not.equal(ZERO_ADDRESS);
        });

        //   it("Should correctly grant the DEFAULT_ADMIN_ROLE", async function () {
        //       const { d } = await loadFixture(setup);

        //       const role = await d;
        //       const hasRole = await s.simpleStorageContract.hasRole(
        //           role,
        //           s.simpleStorageArgs.adminAddress
        //       );

        //       expect(hasRole).to.be.true;
        //   });
    });
});
