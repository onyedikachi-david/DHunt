import { expect } from "chai";
import {
    loadFixture,
    // time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { ProofOfIdTest, randIdArgs } from "../setup";
import {
    DHuntTest,
    // dHuntError
} from "./setup";
import { addTime } from "@utils/time";
import { ZERO_ADDRESS } from "../../constants";
import { PROOF_OF_ID_ATTRIBUTES } from "@utils/deploy/proof-of-identity/deployProofOfIdentity";
import { parseH1 } from "@utils/token";
// import {}

describe("DHunt", function () {
    const exp = BigInt(addTime(Date.now(), 2, "months", "sec"));
    const competencyId = PROOF_OF_ID_ATTRIBUTES.COMPETENCY_RATING.id;

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

        /* Setting and Getting the Value
        ======================================== */

        describe("Creating and getting bounties", function () {
            it("Should correctly create and get bounties", async function () {
                const { poi, d } = await loadFixture(setup);

                const c = d.dhuntContract.connect(d.accounts[0]);

                const addr = d.accountAddresses[0];
                const args = randIdArgs(addr);

                await poi.issueIdentity(args);
                const competencyTx =
                    await poi.proofOfIdContract.setU256Attribute(
                        addr,
                        competencyId,
                        exp,
                        80n
                    );
                await competencyTx.wait();

                const name = "Use shadcn UI";
                const description = "Because why not";
                const reward = parseH1("10");
                const requiresAcceptannce = false;
                const competencyRatingThreshold = 60n;

                const txRes = await c.createBounty(
                    name,
                    description,
                    reward,
                    requiresAcceptannce,
                    competencyRatingThreshold,
                    { value: reward }
                );
                await txRes.wait();

                let v = await c.getBounties();
                console.log(v);
            });
        });

        describe("Getting and joining a bounty", function () {
            it("Should get a bounty and submit a solution successfully", async function () {
                // const bountyId = 0; // Assuming the bounty to get and register is at index 0
                const { poi, d } = await loadFixture(setup);

                const c = d.dhuntContract.connect(d.accounts[0]);

                const addr = d.accountAddresses[0];
                const args = randIdArgs(addr);

                await poi.issueIdentity(args);
                const competencyTx =
                    await poi.proofOfIdContract.setU256Attribute(
                        addr,
                        competencyId,
                        exp,
                        80n
                    );
                await competencyTx.wait();

                const name = "Use shadcn UI";
                const description = "Because why not";
                const reward = parseH1("10");
                const requiresAcceptannce = false;
                const competencyRatingThreshold = 60n;

                const txRes = await c.createBounty(
                    name,
                    description,
                    reward,
                    requiresAcceptannce,
                    competencyRatingThreshold,
                    { value: reward }
                );
                await txRes.wait();
                const bountyId = await c.getBounties();
                console.log(bountyId);
                const checkIsSuspended =
                    await poi.proofOfIdContract.isSuspended(addr);
                console.log(checkIsSuspended);
                // Submit a solution for the bounty
                const solution = "http://github.com/a/solution";
                const registerTx = await c.submitSolution(0, solution);
                await registerTx.wait();

                // Get solutions
                const solutions = await c.getSolutions();
                console.log(solutions);
            });
        });
    });
});
