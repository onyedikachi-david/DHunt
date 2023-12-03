# Haven1 - Proof of Identity Hackathon

Haven1 is an EVM-compatible Layer 1 blockchain seamlessly incorporating key
principles of traditional finance into the Web3 ecosystem.

Among the features introduced by Haven1 is the Provable Identity Framework. This
framework enhances security and unlocks previously unattainable decentralized
finance use cases, marking a significant advancement in the convergence of
traditional financial principles and decentralized technologies.

The Provable Identity Framework is discussed in more detail
[below](#provable-identity-framework).
For more information on Haven1 and the Provable Identity Framework, visit the
[documentation](https://docs.haven1.org) and view the [litepaper](https://docsend.com/view/8hnh4kah6updyzf4).

## Table of Contents
1. [Provable Identity Framework](#provable-identity-framework)
2. [Repository Information](#repository-information)
3. [Preparation](#preparations)
    -    [Prerequisites](#prerequisites)
    -    [Installing](#installing)

<a id="provable-identity-framework"></a>
## Provable Identity Framework

All Haven1 users will be required to complete identity verification to deter
illicit  activity and enable recourse mechanisms on transactions. Once completed,
users will receive a non-transferrable NFT containing anonymized information
that developers on Haven1 can utilize to permission their apps and craft novel
blockchain use cases.

For example, Haven1's compliance with regulatory standards in combination with
the Provable Identity Framework allows for the development of lending markets that
are underpinned by real-world credit scores as reputation backing - similar to traditional loan risk management.

Haven1 enables integration with real-world assets where proof of identity is
required. It can, for instance, facilitate the introduction of investment
vehicles backed by real estate assets, leveraging non-fungible tokens (NFTs)
on-chain to represent ownership of specific properties.

Tokenized digital representations of assets, such as securities and bonds,
become possible in this environment, enabling exchange and settlement with
greater efficiency at a global level.

For more information on Haven1 and the Provable Identity Framework, visit the
[documentation](https://docs.haven1.org) and view the [litepaper](https://docsend.com/view/8hnh4kah6updyzf4).

<a id="repository-information"></a>
## Repository Information
This repository contains everything you need to participate in the hackathon -
please feel free to explore it. Below are a list of important features, their
paths and a link.

| Feature                    | Path                                              | Link                                                                                                                           |
|----------------------------|---------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| `ProofOfIdentity` contract | `contracts/proof-of-identity/ProofOfIdentity.sol` | [link](https://github.com/haven1network/proof-of-identity-hackathon/blob/main/contracts/proof-of-identity/ProofOfIdentity.sol) |
| Examples                   | `contracts/proof-of-identity/examples/*`          | [link](https://github.com/haven1network/proof-of-identity-hackathon/tree/main/contracts/proof-of-identity/examples)            |
| Tests                      | `test/proof-of-identity/*`                        | [link](https://github.com/haven1network/proof-of-identity-hackathon/tree/main/test/proof-of-identity)                          |
| Documentation              | `docs`                                            | [link](https://github.com/haven1network/proof-of-identity-hackathon/tree/main/docs/proof-of-identity)                          |
| Utils                      | `utils`                                           | [link](https://github.com/haven1network/proof-of-identity-hackathon/tree/main/utils)                                           |
| Templates                  | `templates`                                       | [link](https://github.com/haven1network/proof-of-identity-hackathon/tree/main/templates)                                       |

All contracts have been extensively commented to aid in understanding the Provable Identity Framework.

<a id="preparations"></a>
## Preparations

Follow the steps below to setup your hackathon environemnt.

<a id="prerequisites"></a>
### Prerequisites
- [NodeJS](https://nodejs.org/en)

<a id="installing"></a>
### Installing
1. Clone this repo
    ```bash
    git clone git@github.com:haven1network/proof-of-identity-hackathon.git
    ```

2. Change into the directory
    ```bash
    cd proof-of-identity-hackathon
    ```
3. Install dependencies
    ```bash
    npm i
    ```
