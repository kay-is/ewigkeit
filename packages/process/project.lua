local json = require("json")
local bint = require('.bint')(256)
local utils = require(".utils")

---------- State ----------

-- Atomic Asset State
if Name ~= "<NAME>" then Name = "<NAME>" end
if Ticker ~= '<TICKER>' then Ticker = '<TICKER>' end
if Denomination ~= '<DENOMINATION>' then Denomination = '<DENOMINATION>' end
if not Balances then Balances = { [Owner] = '<BALANCE>' } end

Transferable = true

-- Project State
Description = Description or "New Project Description"
Ants = Ants or {}
Domains = Domains or {
  production = "",
  preview = {}
}
Deployments = Deployments or {}
ActiveDeployments = ActiveDeployments or {
  production = "",
  preview = {}
}
DeploymentHashes = DeploymentHashes or {}
Members = Members or {}

---------- Utilities ----------

-- This handler catches all messages from unverified sources
-- and prevents all other handlers from executing
Handlers.prepend(
  "qualify message",
  function(message)
    local trustedMessagingUnit = "fcoN_xJeisVsPXA-trzVAuIiqO3ydLQxM-L4XbrQKzY"

    if message.Owner == trustedMessagingUnit then
      return false
    end
    if message.From == message.Owner then
      return false
    end
    return true
  end,
  function() print("This message is not trusted!") end
)

local function addPublicHandler(action, handler)
  Handlers.add(
    action,
    Handlers.utils.hasMatchingTag("Action", action),
    function(message)
      local replyData = handler(message) or {}

      if message.Cast or message.Cron then
        return
      end

      if replyData == "NoReply" then
        return
      end

      local response = {
        Target = message.From,
        Tags = {}
      }

      if message.Tags.RequestId then
        response.Tags.ResponseFor = message.Tags.RequestId
      end

      if replyData and replyData.Error then
        response.Action = action .. "-Error"
        response.Tags.Error = replyData.Error
        ao.send(response)
        return
      end

      if replyData then
        response.Data = json.encode(replyData)
      end

      response.Action = action .. "-Success"

      ao.send(response)
    end
  )
end

local function addProtectedHandler(action, handler)
  addPublicHandler(action, function(message)
    local member = utils.find(
      function(member) return member.Address == message.From end,
      Members
    )

    if member == nil and message.From ~= Owner then
      return { Error = "Unauthorized" }
    end

    return handler(message)
  end
  )
end
local function addOwnerHandler(action, handler)
  addPublicHandler(action, function(message)
    if message.From ~= Owner then
      return { Error = "Unauthorized" }
    end

    return handler(message)
  end
  )
end

local function checkValidAddress(address)
  if not address or type(address) ~= 'string' then
    return false
  end

  return string.match(address, "^[%w%-_]+$") ~= nil and #address == 43
end

local function checkValidAmount(data)
  return (math.type(tonumber(data)) == 'integer' or math.type(tonumber(data)) == 'float') and bint(data) > 0
end

local function decodeMessageData(data)
  local status, decodedData = pcall(json.decode, data)

  if not status or type(decodedData) ~= 'table' then
    return false, nil
  end

  return true, decodedData
end

---------- Info ----------

addPublicHandler(
  "Info",
  function(message)
    return {
      Id = ao.id,
      Name = Name,
      Ticker = Ticker,
      Denomination = Denomination,
      Balances = Balances,
      Transferable = Transferable,
      Description = Description,
      Members = Members,
      Ants = Ants,
      Domains = Domains,
      ActiveDeployments = ActiveDeployments,
      Deployments = Deployments
    }
  end
)

addOwnerHandler(
  "Set-Description",
  function(message)
    Description = message.Tags.Description
  end
)

---------- Ants ----------

addProtectedHandler(
  "Add-Ant",
  function(message)
    Ants[message.Tags.ArnsDomain] = message.Tags.AntAddress
  end
)

addProtectedHandler(
  "Remove-Ant",
  function(message)
    Ants[message.Tags.ArnsDomain] = nil
  end
)

---------- Domains ----------

addProtectedHandler(
  "Assign-Domain-To-Environment",
  function(message)
    if message.Tags.Environment == "production" then
      Domains.production = message.Tags.ArnsDomain
    else
      Domains.preview[message.Tags.Branch] = message.Tags.ArnsDomain
    end
  end
)

addProtectedHandler(
  "Remove-Domain-From-Environment",
  function(message)
    if message.Tags.Environment == "production" then
      Domains.production = nil
    else
      Domains.preview[message.Tags.Branch] = nil
    end
  end
)

local function splitString(input, separator)
  if separator == nil then separator = "%s" end

  local output = {}
  for word in string.gmatch(input, "([^" .. separator .. "]+)") do
    output[#output + 1] = word
  end

  return output
end

local function joinArray(input, separator)
  local output = ""
  for _, word in ipairs(input) do
    output = output .. separator .. word
  end
  return output
end

addProtectedHandler(
  "Assign-Domain-To-Deployment",
  function(message)
    local deployment = utils.find(
      function(deployment) return deployment.Id == message.Tags.DeploymentId end,
      Deployments
    )

    if not deployment then
      return { Error = "Deployment not found: " .. message.Tags.DeploymentId }
    end

    local domainWithUndernames
    if deployment.Environment == "production" then
      domainWithUndernames = Domains.production
      ActiveDeployments.production = deployment.Id
    else
      domainWithUndernames = Domains.preview[deployment.Branch]
      ActiveDeployments.preview[deployment.Branch] = deployment.Id
    end

    if not domainWithUndernames then
      return { Error = "No domain defined for environment: " .. deployment.Environment }
    end

    -- If the domain has undernames, we need to split it to extract the root domain
    local domainArray = splitString(domainWithUndernames, "_")
    local domain = domainArray[#domainArray]

    local antAddress = Ants[domain]

    if not antAddress then
      return { Error = "ANT not found for domain: " .. domain }
    end

    -- If we set the root domain, we need to use @ instead of the undername
    local undername = "@"
    if domainWithUndernames ~= domain then
      domainArray[#domainArray] = nil
      undername = joinArray(domainArray, "_")
    end

    ao.send({
      Target = antAddress,
      Action = "Set-Record",
      Tags = {
        ["Sub-Domain"] = undername,
        ["Transaction-Id"] = deployment.Id,
        ["TTL-Seconds"] = "900"
      }
    })

    return { ArnsDomain = domainWithUndernames, AntAddress = antAddress }
  end
)

---------- Deployments ----------

addProtectedHandler(
  "Add-Deployment",
  function(message)
    local newDeployment = {
      Id = message.Tags.DeploymentId,
      Environment = message.Tags.Environment,
      CreatedAt = tonumber(message.Tags.CreatedAt),
      CreatedBy = message.Tags.CreatedBy
    }

    if message.Tags.Environment == "preview" then
      newDeployment.Branch = message.Tags.Branch
    end

    Deployments[#Deployments + 1] = newDeployment
  end
)

addProtectedHandler(
  "Add-Deployment-Hashes",
  function(message)
    local hashes = json.decode(message.Data)
    for hash, txId in pairs(hashes) do
      DeploymentHashes[hash] = txId
    end
  end
)

addProtectedHandler(
  "Remove-Deployment-Hashes",
  function(message)
    local hashes = json.decode(message.Data)
    for hash, _ in pairs(hashes) do
      DeploymentHashes[hash] = nil
    end
  end
)

addPublicHandler(
  "Get-Deployment-Hashes",
  function()
    return DeploymentHashes
  end
)

---------- Members ----------

addOwnerHandler(
  "Add-Member",
  function(message)
    Members[#Members + 1] = {
      Address = message.Tags.MemberAddress,
      Name = message.Tags.MemberName
    }
  end
)

addOwnerHandler(
  "Remove-Member",
  function(message)
    Members = utils.filter(
      function(member) return member.Address ~= message.Tags.MemberAddress end,
      Members
    )
  end
)

---------- Atomic Asset ----------

addPublicHandler(
  "Transfer",
  function(message)
    if not Transferable then
      ao.send({
        Target = message.From,
        Action = 'Validation-Error',
        Tags = { Status = 'Error', Message = 'Transfers are not allowed' }
      })
      return "NoReply"
    end

    local data = {
      Recipient = message.Tags.Recipient,
      Quantity = message.Tags.Quantity
    }

    if checkValidAddress(data.Recipient) and checkValidAmount(data.Quantity) then
      -- Transfer is valid, calculate balances
      if not Balances[data.Recipient] then
        Balances[data.Recipient] = '0'
      end

      Balances[message.From] = tostring(bint(Balances[message.From]) - bint(data.Quantity))
      Balances[data.Recipient] = tostring(bint(Balances[data.Recipient]) + bint(data.Quantity))

      -- If new balance zeroes out then remove it from the table
      if bint(Balances[message.From]) <= 0 then
        Balances[message.From] = nil
      end
      if bint(Balances[data.Recipient]) <= 0 then
        Balances[data.Recipient] = nil
      end

      local debitNoticeTags = {
        Status = 'Success',
        Message = 'Balance transferred, debit notice issued',
        Recipient = message.Tags.Recipient,
        Quantity = message.Tags.Quantity,
      }

      local creditNoticeTags = {
        Status = 'Success',
        Message = 'Balance transferred, credit notice issued',
        Sender = message.From,
        Quantity = message.Tags.Quantity,
      }

      for tagName, tagValue in pairs(message) do
        if string.sub(tagName, 1, 2) == 'X-' then
          debitNoticeTags[tagName] = tagValue
          creditNoticeTags[tagName] = tagValue
        end
      end

      -- Send a debit notice to the sender
      ao.send({
        Target = message.From,
        Action = 'Debit-Notice',
        Tags = debitNoticeTags,
        Data = json.encode({
          Recipient = data.Recipient,
          Quantity = tostring(data.Quantity)
        })
      })

      -- Send a credit notice to the recipient
      ao.send({
        Target = data.Recipient,
        Action = 'Credit-Notice',
        Tags = creditNoticeTags,
        Data = json.encode({
          Sender = message.From,
          Quantity = tostring(data.Quantity)
        })
      })
    end
    return "NoReply"
  end
)

addPublicHandler(
  'Mint',
  function(message)
    local decodeCheck, messageData = decodeMessageData(message.Data)

    if not decodeCheck or not messageData then
      ao.send({
        Target = message.From,
        Action = 'Input-Error',
        Tags = {
          Status = 'Error',
          Message = string.format('Failed to parse data, received: %s. %s', message.Data,
            'Data must be an object - { Quantity }')
        }
      })
      return "NoReply"
    end

    -- Check if quantity is present
    if not messageData.Quantity then
      ao.send({
        Target = message.From,
        Action = 'Input-Error',
        Tags = { Status = 'Error', Message = 'Invalid arguments, required { Quantity }' }
      })
      return "NoReply"
    end

    -- Check if quantity is a valid integer greater than zero
    if not checkValidAmount(messageData.Quantity) then
      ao.send({
        Target = message.From,
        Action = 'Validation-Error',
        Tags = { Status = 'Error', Message = 'Quantity must be an integer greater than zero' }
      })
      return "NoReply"
    end

    -- Check if owner is sender
    if message.From ~= Owner then
      ao.send({
        Target = message.From,
        Action = 'Validation-Error',
        Tags = { Status = 'Error', Message = 'Only the process owner can mint new tokens' }
      })
      return "NoReply"
    end

    -- Mint request is valid, add tokens to the pool
    if not Balances[Owner] then
      Balances[Owner] = '0'
    end

    Balances[Owner] = tostring(bint(Balances[Owner]) + bint(messageData.Quantity))

    ao.send({
      Target = message.From,
      Action = 'Mint-Success',
      Tags = { Status = 'Success', Message = 'Tokens minted' }
    })
    return "NoReply"
  end)

addPublicHandler(
  'Balance',
  function(message)
    local decodeCheck, messageData = decodeMessageData(message.Data)

    if not decodeCheck or not messageData then
      ao.send({
        Target = message.From,
        Action = 'Input-Error',
        Tags = {
          Status = 'Error',
          Message = string.format('Failed to parse data, received: %s. %s', message.Data,
            'Data must be an object - { Target }')
        }
      })
      return "NoReply"
    end

    -- Check if target is present
    if not messageData.Target then
      ao.send({
        Target = message.From,
        Action = 'Input-Error',
        Tags = { Status = 'Error', Message = 'Invalid arguments, required { Target }' }
      })
      return "NoReply"
    end

    -- Check if target is a valid address
    if not checkValidAddress(messageData.Target) then
      ao.send({
        Target = message.From,
        Action = 'Validation-Error',
        Tags = { Status = 'Error', Message = 'Target is not a valid address' }
      })
      return "NoReply"
    end

    -- Check if target has a balance
    if not Balances[messageData.Target] then
      ao.send({
        Target = message.From,
        Action = 'Read-Error',
        Tags = { Status = 'Error', Message = 'Target does not have a balance' }
      })
      return "NoReply"
    end

    ao.send({
      Target = message.From,
      Action = 'Read-Success',
      Tags = { Status = 'Success', Message = 'Balance received' },
      Data = Balances[messageData.Target]
    })

    return "NoReply"
  end
)

addPublicHandler(
  'Balances',
  function()
    return { Data = Balances }
  end
)

ao.send({ Target = Owner, Action = "Eval-Success" })
