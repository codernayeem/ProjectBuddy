# ProjectBuddy API - Postman Testing Guide

This guide will help you test the ProjectBuddy backend API using the provided Postman collection.

## 🚀 Quick Setup

### 1. Import the Collection
1. Open Postman
2. Click **Import** button (top left)
3. Select **Upload Files** tab
4. Choose the `ProjectBuddy_Postman_Collection.json` file
5. Click **Import**

### 2. Set Base URL
The collection includes a `base_url` variable set to `http://localhost:3001`. Update this if your server runs on a different port:
1. In Postman, click on the collection name "ProjectBuddy API"
2. Go to **Variables** tab
3. Update the `base_url` value if needed

### 3. Start Your Backend Server
```bash
cd backend
npm run dev
```

## 🔥 Testing Workflow (Recommended Order)

### Phase 1: Authentication Setup ✅

#### 1. **Signup** (Create Main User)
- **Folder**: Authentication
- **Description**: Creates user "John Doe" with developer profile
- **Expected**: Status 201, user data returned
- **Note**: Pre-filled with realistic demo data

#### 2. **Login** (Get Token)
- **Folder**: Authentication  
- **Description**: Login with John Doe credentials
- **Auto-Magic**: ✨ Token and User ID automatically saved to collection variables
- **Expected**: Status 200, token in response
- **Check**: Console should show "Token set: ..." and "User ID set: ..."

#### 3. **Get Profile** (Verify Token)
- **Folder**: Authentication
- **Description**: Verify authentication works
- **Expected**: Status 200, complete user profile

### Phase 2: Content Management 📝

#### 4. **Create Post** (First Post)
- **Folder**: Posts
- **Description**: Creates a React project showcase post
- **Auto-Magic**: ✨ Post ID automatically saved to collection variables
- **Expected**: Status 201, post data returned

#### 5. **Get User Posts** (Test the Fix!)
- **Folder**: Posts
- **Description**: Get posts by current user (tests the fix we made)
- **Expected**: Status 200, should show the post you just created
- **Important**: This tests the fix for the `1=0` SQL issue!

#### 6. **Get Feed**
- **Folder**: Posts
- **Description**: Get personalized feed
- **Expected**: Status 200, posts array (includes your posts)

#### 7. **Search Posts**
- **Folder**: Posts
- **Description**: Search for posts containing "react"
- **Expected**: Status 200, matching posts

### Phase 3: Post Interactions 💬

#### 8. **React to Post**
- **Folder**: Posts
- **Description**: Add a LIKE reaction to your post
- **Auto-Uses**: Post ID from step 4
- **Expected**: Status 201, reaction data

#### 9. **Add Comment**
- **Folder**: Posts
- **Description**: Comment on your post
- **Auto-Uses**: Post ID from step 4
- **Expected**: Status 201, comment data

#### 10. **Get Post Comments**
- **Folder**: Posts
- **Description**: View comments on your post
- **Expected**: Status 200, comments array

#### 11. **Bookmark Post**
- **Folder**: Posts
- **Description**: Bookmark your post
- **Expected**: Status 201, bookmark data

### Phase 4: User Management 👥

#### 12. **Update Profile**
- **Folder**: Users
- **Description**: Update profile with more details
- **Expected**: Status 200, updated profile

#### 13. **Get User by ID**
- **Folder**: Users
- **Description**: Get user info by ID
- **Auto-Uses**: User ID from login
- **Expected**: Status 200, user details

#### 14. **Search Users**
- **Folder**: Users
- **Description**: Search for users containing "john"
- **Expected**: Status 200, matching users

### Phase 5: Demo Data Creation 🎭

#### 15. **Create Demo User 2 (Jane)**
- **Folder**: Demo Data Creation
- **Description**: Creates Jane Smith (Designer)
- **Expected**: Status 201, user created
- **Note**: Copy the user ID for connection testing

#### 16. **Create Demo User 3 (Mike)**
- **Folder**: Demo Data Creation
- **Description**: Creates Mike Johnson (Project Manager)
- **Expected**: Status 201, user created

#### 17. **Create More Demo Posts**
- **Folder**: Demo Data Creation
- **Description**: Create additional posts for testing
- **Expected**: Status 201 for each post

### Phase 6: Social Features 🤝

#### 18. **Send Connection Request**
- **Folder**: Connections
- **Description**: Send connection to another user
- **Manual Step**: Replace "USER_ID_HERE" with Jane's or Mike's user ID
- **Expected**: Status 201, connection request sent

#### 19. **Get Received Requests**
- **Folder**: Connections
- **Description**: View connection requests
- **Expected**: Status 200, requests array

#### 20. **Accept/Reject Connection**
- **Folder**: Connections
- **Description**: Manage connection requests
- **Manual Step**: Set `connection_id` variable from received requests
- **Expected**: Status 200, connection updated

### Phase 7: Team Management 👫

#### 21. **Create Team**
- **Folder**: Teams
- **Description**: Create "React Masters" team
- **Auto-Magic**: ✨ Team ID automatically saved to collection variables
- **Expected**: Status 201, team data

#### 22. **Get All Teams**
- **Folder**: Teams
- **Description**: Browse available teams
- **Expected**: Status 200, teams array

#### 23. **Join Team**
- **Folder**: Teams
- **Description**: Join the created team
- **Auto-Uses**: Team ID from step 21
- **Expected**: Status 200, membership confirmed

#### 24. **Get Team Posts**
- **Folder**: Teams
- **Description**: View team posts
- **Expected**: Status 200, team posts array

## 🔧 Collection Variables

The collection automatically manages these variables:

| Variable | Description | Auto-Set By |
|----------|-------------|-------------|
| `base_url` | API base URL | Manual setup |
| `auth_token` | JWT token | Login endpoint |
| `user_id` | Current user ID | Login endpoint |
| `post_id` | Created post ID | Create Post endpoint |
| `team_id` | Created team ID | Create Team endpoint |
| `connection_id` | Connection ID | Manual (from responses) |

## 📋 Auto-Magic Features

### 1. **Token Management**
- Login automatically extracts and saves JWT token
- All authenticated endpoints use the saved token
- No manual token copying needed!

### 2. **ID Management**
- User ID automatically saved after login
- Post ID automatically saved after post creation
- Team ID automatically saved after team creation

### 3. **Console Logging**
- Login shows token confirmation in console
- Post creation shows post ID in console
- Team creation shows team ID in console

## 🎯 Expected Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ },
  "timestamp": "2025-10-08T07:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "timestamp": "2025-10-08T07:30:00.000Z"
}
```

## 🔍 Testing the Main Fix

The most important test is **Step 5: Get User Posts**. This endpoint was returning no results due to the `1=0` SQL condition we fixed. After running this request, you should see:

✅ **Before Fix**: Empty array `{ "data": [], "pagination": { "total": 0 } }`
✅ **After Fix**: Your posts `{ "data": [{ "id": "...", "content": "..." }], "pagination": { "total": 1 } }`

## 🚨 Troubleshooting

### 401 Unauthorized
- **Cause**: Missing or expired token
- **Fix**: Re-run the Login request

### 400 Bad Request  
- **Cause**: Invalid request data
- **Fix**: Check request body format

### 404 Not Found
- **Cause**: Resource doesn't exist
- **Fix**: Verify IDs are correct

### Variables Not Set
- **Cause**: Automatic scripts didn't run
- **Fix**: Check Postman console for errors

## 💡 Pro Tips

1. **Follow the Order**: Run requests in the suggested sequence
2. **Check Console**: Watch for auto-set variable confirmations
3. **Copy IDs**: Manually set `connection_id` when needed
4. **Environment**: Ensure server is running before testing
5. **Responses**: Verify each response before continuing

## 📊 What This Tests

- ✅ User authentication and authorization
- ✅ User profile management
- ✅ Post creation and retrieval
- ✅ Post interactions (reactions, comments, bookmarks)
- ✅ User search and discovery
- ✅ Social connections
- ✅ Team creation and management
- ✅ Content feeds and search
- ✅ **The main getUserPosts fix!**

Happy testing! 🚀