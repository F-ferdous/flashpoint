# CPX Research Integration Guide

This document explains the CPX Research integration implemented in your FlashPoint earning-based website.

## Overview

CPX Research is a survey monetization platform that allows users to complete surveys and earn rewards. This integration provides:

- **Survey Widget Integration**: Secure iframe-based survey interface
- **Real-time Earnings Tracking**: Automatic point/cash conversion and database updates
- **Secure Callback Handling**: Verified postback system for completed surveys
- **Dashboard Integration**: Real-time earnings display and activity tracking

## Features Implemented

### 1. Enhanced Earnings Dashboard (`/userDashboard/earnings`)
- **Multiple Task Types**: Surveys, video ads, app installs, special offers, daily tasks
- **CPX Research Integration**: Direct survey access with secure authentication  
- **Real-time Point Updates**: Live Firebase integration showing current balance
- **Earnings History**: Complete transaction history with source tracking
- **Task Cards**: Interactive cards for different earning opportunities

### 2. Updated Main Dashboard (`/userDashboard`)
- **Live Statistics**: Real-time points balance and monthly earnings
- **Recent Activity Feed**: Shows latest survey completions and earnings
- **Monthly Analytics**: Tracks surveys completed and total tasks this month
- **Quick Access**: Direct "Earn More" button linking to earnings page

### 3. Secure API Integration

#### URL Generation (`/api/cpx-research/generate-url`)
- Generates secure CPX Research URLs for authenticated users
- Uses MD5 hash verification (appId + userId + secureHash)
- Supports custom SubID parameters for tracking
- Handles missing credentials gracefully with helpful error messages

#### Callback Handler (`/api/cpx-research/callback`)
- Processes CPX Research postback notifications
- Verifies callback authenticity using secure hash validation
- Handles both completed surveys (rewards) and chargebacks (refunds)
- Updates Firebase user points and transaction history
- Prevents duplicate transaction processing

### 4. Database Schema

#### User Points
```javascript
// users/{userId}
{
  points: number,           // Current point balance
  updatedAt: timestamp     // Last update time
}
```

#### Transaction Records
```javascript
// users/{userId}/cpx_transactions/{transactionId}
{
  transactionId: string,
  rewardAmount: number,     // Original USD amount
  currency: string,         // Currency (USD)
  pointsEarned: number,     // Converted points (USD * 100)
  status: 'completed' | 'chargeback',
  source: 'cpx_research',
  createdAt: timestamp,
  chargebackAt?: timestamp  // Only for chargebacks
}
```

#### Earnings Ledger
```javascript
// users/{userId}/offerwall_ledger/{entryId}
{
  amount: number,           // Points earned/deducted
  offer_name: string,       // Description
  source: string,           // 'cpx_research' or 'cpx_research_chargeback'
  transactionId: string,    // Reference to original transaction
  ts: timestamp
}
```

## Configuration Setup

### Environment Variables
Add these to your `.env.local` file:

```bash
# CPX Research credentials (PLACEHOLDER - Replace with actual values)
CPX_RESEARCH_APP_ID=YOUR_CPX_APP_ID
CPX_RESEARCH_SECURE_HASH=YOUR_CPX_SECURE_HASH
CPX_RESEARCH_SUBID_1=YOUR_SUBID_1
CPX_RESEARCH_SUBID_2=YOUR_SUBID_2
```

### CPX Research Dashboard Configuration
1. **Postback URL**: Set to `https://yourdomain.com/api/cpx-research/callback`
2. **Parameters to Send**:
   - transaction_id
   - user_id (this will be your Firebase user UID)
   - reward (USD amount)
   - currency_name
   - timestamp
   - ip
   - status (1 for completed, 2 for chargeback)
   - hash (security verification)

## Security Features

### 1. Hash Verification
- All CPX Research interactions use MD5 hash verification
- URL generation: `MD5(appId + userId + secureHash)`
- Callback verification: `MD5(transaction_id + user_id + reward + currency + timestamp + status + ip + secure_hash)`

### 2. Duplicate Prevention
- Transaction IDs are stored to prevent duplicate processing
- Callback handler checks for existing transactions before processing

### 3. User Authentication
- All API endpoints require valid user authentication
- Firebase security rules protect user data access

## Conversion Rates

- **Points to USD**: 100 points = $1.00 USD
- **Minimum Survey Rewards**: Typically $0.25 - $5.00
- **Point Range**: 25 - 500 points per survey

## Error Handling

### API Response Formats

#### Success Response (URL Generation)
```json
{
  "success": true,
  "url": "https://offers.cpx-research.com/index.php?app_id=...",
  "message": "CPX Research URL generated successfully"
}
```

#### Error Response (Missing Configuration)
```json
{
  "error": "CPX Research not configured. Please add your credentials to .env.local",
  "missingCredentials": ["CPX_RESEARCH_APP_ID", "CPX_RESEARCH_SECURE_HASH"]
}
```

#### Callback Responses
- **Success**: Returns `"1"` (required by CPX Research)
- **Failure**: Returns `"0"` with appropriate HTTP status

## User Experience Flow

### Survey Completion Flow
1. User clicks "Complete Surveys" in earnings dashboard
2. System generates secure CPX Research URL with user's Firebase UID
3. Survey opens in new window/tab
4. User completes survey on CPX Research platform
5. CPX Research sends postback notification to callback endpoint
6. System verifies callback authenticity and updates user points
7. User sees updated points balance in real-time (Firebase listeners)
8. Transaction appears in earnings history

### Dashboard Updates
- **Real-time**: Point balance updates immediately via Firebase listeners
- **Statistics**: Monthly earnings and survey counts update automatically
- **History**: New transactions appear in earnings ledger instantly

## Testing

### Development Testing
1. Use CPX Research sandbox/test mode if available
2. Test with placeholder credentials first
3. Verify callback URL is accessible from external services
4. Check Firebase security rules allow proper data access

### Production Checklist
- [ ] CPX Research account configured with live credentials
- [ ] Postback URL pointing to production domain
- [ ] Environment variables set with real values
- [ ] Firebase security rules properly configured
- [ ] SSL certificate valid for callback endpoint

## Troubleshooting

### Common Issues

#### "CPX Research not configured" Error
- Check `.env.local` contains all required CPX Research credentials
- Restart Next.js development server after adding environment variables

#### Callbacks Not Working
- Verify postback URL is accessible externally
- Check CPX Research dashboard for callback configuration
- Review server logs for callback processing errors
- Ensure hash verification is working correctly

#### Points Not Updating
- Check Firebase security rules
- Verify user authentication state
- Review callback handler logs for processing errors

### Debug Mode
Enable detailed logging by adding console.log statements in:
- `/api/cpx-research/callback/route.ts` - callback processing
- `/api/cpx-research/generate-url/route.ts` - URL generation

## Next Steps

### Expansion Opportunities
1. **Additional Survey Providers**: Integrate more survey platforms
2. **Video Ads**: Implement video ad networks (AdMob, etc.)
3. **App Install Tracking**: Add mobile app install offers
4. **Referral System**: Bonus points for user referrals
5. **Withdrawal System**: Allow users to cash out earnings

### Analytics Integration
- Track conversion rates by survey type
- Monitor user engagement metrics
- A/B test different reward structures

## Rollback Instructions

If you need to revert to the previous state:

```bash
git reset --hard HEAD~1  # Revert to backup commit
```

The backup commit was created with message: "Backup: Current state before CPX Research integration"

## Support

For issues or questions about this integration:
1. Check the troubleshooting section above
2. Review CPX Research documentation
3. Check Firebase console for data access issues
4. Review Next.js API route logs for errors

## Security Notes

- Never expose CPX_RESEARCH_SECURE_HASH to client-side code
- All sensitive operations happen server-side only
- Hash verification prevents unauthorized reward credits
- Firebase security rules protect user earnings data

---

**Implementation Status**: ✅ Complete
**Last Updated**: $(date)
**Version**: 1.0.0