$ErrorActionPreference = 'Stop'
$baseUrl = 'http://localhost:8080/api'

Write-Host '1. Register'
$regBody = @{
    firstName = 'Test2'
    lastName = 'User2'
    email = 'testuser2@test.com'
    phone = '9999999998'
    password = 'Password@123'
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $regBody -ContentType 'application/json'
} catch {}

Write-Host '2. Login'
$loginBody = @{
    email = 'testuser2@test.com'
    password = 'Password@123'
} | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType 'application/json'
$token = $loginRes.token
$headers = @{ Authorization = "Bearer $token" }
Write-Host "Token: $token"

Write-Host '3. Check Wallet'
$walletRes = Invoke-RestMethod -Uri "$baseUrl/wallet" -Method Get -Headers $headers
Write-Host ($walletRes | ConvertTo-Json -Depth 3)

Write-Host '4. Deposit INR'
$depBody = @{
    amount = 50000
    symbol = 'INR'
    method = 'RAZORPAY'
} | ConvertTo-Json
$depRes = Invoke-RestMethod -Uri "$baseUrl/wallet/deposit" -Method Post -Body $depBody -ContentType 'application/json' -Headers $headers
Write-Host ($depRes | ConvertTo-Json)

Write-Host '5. Buy BTC'
$buyBody = @{
    symbol = 'BTC'
    quantity = 0.001
} | ConvertTo-Json
$buyRes = Invoke-RestMethod -Uri "$baseUrl/wallet/buy" -Method Post -Body $buyBody -ContentType 'application/json' -Headers $headers
Write-Host ($buyRes | ConvertTo-Json)

Write-Host '6. Check Wallet Again'
$walletRes2 = Invoke-RestMethod -Uri "$baseUrl/wallet" -Method Get -Headers $headers
Write-Host ($walletRes2 | ConvertTo-Json -Depth 3)
