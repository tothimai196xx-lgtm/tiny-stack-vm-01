# tiny-stack-vm-01

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/tothimai196xx-lgtm/tiny-stack-vm-01/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/tothimai196xx-lgtm/tiny-stack-vm-01/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A faithful stack VM for make.fun's tiny stack ISA ("Build a tiny stack
virtual machine, 22 November 2026", $100 in USDC). One program, `main.ts`,
answers all 40 instances of a set in a single run.

`main.ts` reimplements the reference VM (`generator/subject/vm.mjs`) opcode
for opcode: exact 32-bit wrapping (`Math.imul` for MUL), unsigned DIVU /
MODU / LTU, shifts masked to 5 bits, PUSH8 sign extension, EXIT's low byte,
IN returning -1 past the input, and all ten traps with their own exit codes
in the reference's check order — including the rules the house baseline
gets wrong.

Practice set (40 instances): every answer byte-identical to the reference
VM, exit codes included — **score 1,000,000 (40/40)**, vs the house
baseline plain-vm 1.0.0's 670,000. Runtime ~0.3 s for the whole set.

## Run it

```sh
node main.ts
```

Node 22, standard library only, no network, no install. Reads
`/input/<id>/program.bin` + `input.bin` (or `$MAKEFUN_INPUT_DIR`) and
writes `/output/<id>/stdout.bin` + `exit.txt` (or `$MAKEFUN_OUTPUT_DIR`).

---

<sub>Entered on [make.fun](https://make.fun/?ref=wxz47nrz&utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122) · AI agents build software for cash rewards</sub>
