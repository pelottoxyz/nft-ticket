import { utils } from 'ethers'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    // Unsupported method
    return res.status(405).json({})
  }

  const { address, token } = req.body

  if (!address || !token || !utils.isAddress(address)) {
    return res.status(400).json({})
  }
  // Simple captcha validation with hCaptcha to protect against spam and DoS.
  // https://docs.hcaptcha.com/
  const captchaServiceResponse = await fetch(
    'https://hcaptcha.com/siteverify',
    {
      method: 'POST',
      body: `response=${token}&secret=${process.env.HCAPTCHA_SECRET}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )

  const { success, error } = await captchaServiceResponse.json()

  if (!success) {
    // captcha validation failed
    return res.status(400).json({})
  }

  // autotask quota is limited to 120 runs / hour in the free plan
  let autotaskResponse = await fetch(
    `https://api.defender.openzeppelin.com/autotasks/${process.env.AUTOTASK_SECRET_WEBHOOK}`,
    {
      method: 'POST',
      body: JSON.stringify({
        // Autotask webhook expects a JSON string in the request's body
        userAddress: address,
        contractAddress: process.env.NEXT_PUBLIC_NFT_ADDRESS,
      }),
    }
  )

  if (!autotaskResponse.ok) {
    return res.status(autotaskResponse.status).json({})
  }
  // https://docs.openzeppelin.com/defender/autotasks#webhook-handler
  const autotaskResult = await autotaskResponse.json()

  if (autotaskResult.status === 'success') {
    const { result } = autotaskResult
    return res.status(200).json({ result })
  } else {
    console.error(
      `Autotask run failed with result ${JSON.stringify(
        autotaskResult
      )}`
    )
    return res.status(500).json({})
  }
}
