import { expect, test } from "vitest"
import { render, screen } from "@testing-library/svelte"
import { userEvent } from "@testing-library/user-event"

import ProductionDomainModal from "./productionDomainModal.svelte"

test("Production domain modal", async () => {
  const user = userEvent.setup()

  const testDomain = "domain"
  const testUndername = "undername"
  const testResult = testUndername + "_" + testDomain

  render(ProductionDomainModal, {
    open: true,
    ants: { [testDomain]: "abcd12345" },
    domains: { production: "", preview: {} },
    onSubmit: (domainUpdate) => {
      expect(domainUpdate.arnsDomain).toEqual(testResult)
      expect(domainUpdate.updateActiveDeployment).toBe(true)
    },
  })

  const domainSelect = screen.getByLabelText<HTMLSelectElement>("ArNS Domain")
  await user.selectOptions(domainSelect, testDomain)

  const undernameInput = screen.getByLabelText<HTMLInputElement>("Undername")
  await user.type(undernameInput, testUndername)

  const submitButton = screen.getByText("Set Domain")
  await user.click(submitButton)
})
