import { render, screen } from "@testing-library/svelte"
import { expect, test } from "vitest"

import Wallet from "./wallet.test.svelte"

test("Connection buttons work", async () => {
  const name = "test-" + Math.random()
  render(Wallet, { name })

  const connectButton = screen.getByRole("button")
  await connectButton.click()

  const walletNameInput = screen.getByDisplayValue(name)
  expect(walletNameInput).toBeInTheDocument()

  const disconnectButton = screen.getByRole("button")
  await disconnectButton.click()

  expect(walletNameInput).not.toBeInTheDocument()
})
