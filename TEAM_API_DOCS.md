# Team Management API Documentation

## Overview
Complete REST API for managing team roles, invitations, and join requests in ProjectBuddy.

**Base URL:** `http://localhost:5000/api`

**Authentication:** All endpoints require Bearer token authentication.

---

## 🎭 Team Roles API

### 1. Get Team Roles
Get all custom roles for a team.

**Endpoint:** `GET /teams/:teamId/roles`

**Auth:** Required (any team member)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Developer",
      "description": "Team developers",
      "color": "#3B82F6",
      "isAdmin": false,
      "teamId": "uuid",
      "createdAt": "2025-10-18T10:00:00Z",
      "members": [
        {
          "id": "uuid",
          "userId": "uuid",
          "customRoleId": "uuid"
        }
      ]
    }
  ]
}
```

---

### 2. Create Role
Create a new custom role (admin only).

**Endpoint:** `POST /teams/:teamId/roles`

**Auth:** Required (team admin)

**Request Body:**
```json
{
  "name": "Developer",
  "description": "Team developers",
  "color": "#3B82F6",
  "isAdmin": false
}
```

**Validation:**
- `name`: Required, 1-50 characters
- `description`: Optional, max 200 characters
- `color`: Optional, valid hex color (#RRGGBB)
- `isAdmin`: Optional, boolean, default false

**Response:**
```json
{
  "success": true,
  "message": "Role created successfully",
  "data": {
    "id": "uuid",
    "name": "Developer",
    "description": "Team developers",
    "color": "#3B82F6",
    "isAdmin": false,
    "teamId": "uuid",
    "createdAt": "2025-10-18T10:00:00Z"
  }
}
```

---

### 3. Update Role
Update an existing role (admin only).

**Endpoint:** `PUT /teams/:teamId/roles/:roleId`

**Auth:** Required (team admin)

**Request Body:**
```json
{
  "name": "Senior Developer",
  "description": "Senior team developers",
  "color": "#1E40AF",
  "isAdmin": true
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Response:**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "id": "uuid",
    "name": "Senior Developer",
    "description": "Senior team developers",
    "color": "#1E40AF",
    "isAdmin": true,
    "teamId": "uuid",
    "updatedAt": "2025-10-18T11:00:00Z"
  }
}
```

---

### 4. Delete Role
Delete a role (admin only).

**Endpoint:** `DELETE /teams/:teamId/roles/:roleId`

**Auth:** Required (team admin)

**Response:**
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**Note:** Cannot delete role if members are assigned to it.

---

### 5. Assign Role to Member
Assign a role to a team member (admin only).

**Endpoint:** `POST /teams/:teamId/members/:memberId/roles/:roleId`

**Auth:** Required (team admin)

**Response:**
```json
{
  "success": true,
  "message": "Role assigned successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "teamId": "uuid",
    "customRoles": [
      {
        "customRole": {
          "id": "uuid",
          "name": "Developer",
          "isAdmin": false
        }
      }
    ]
  }
}
```

---

### 6. Remove Role from Member
Remove a role from a team member (admin only).

**Endpoint:** `DELETE /teams/:teamId/members/:memberId/roles/:roleId`

**Auth:** Required (team admin)

**Response:**
```json
{
  "success": true,
  "message": "Role removed successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "teamId": "uuid",
    "customRoles": []
  }
}
```

---

### 7. Get Member Roles
Get all roles assigned to a specific member.

**Endpoint:** `GET /teams/:teamId/members/:memberId/roles`

**Auth:** Required (any team member)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "customRole": {
        "id": "uuid",
        "name": "Developer",
        "description": "Team developers",
        "color": "#3B82F6",
        "isAdmin": false
      }
    }
  ]
}
```

---

## 📨 Team Invitations API

### 1. Invite User
Invite a user to join the team.

**Endpoint:** `POST /teams/:teamId/invitations`

**Auth:** Required (any team member)

**Request Body:**
```json
{
  "inviteeId": "uuid",
  "message": "Join our awesome team!"
}
```

**OR invite by email:**
```json
{
  "email": "user@example.com",
  "message": "Join our awesome team!"
}
```

**Validation:**
- Either `inviteeId` or `email` is required
- `message`: Optional, max 500 characters
- `email`: Must be valid email format

**Response:**
```json
{
  "success": true,
  "message": "Invitation sent successfully",
  "data": {
    "id": "uuid",
    "teamId": "uuid",
    "inviterId": "uuid",
    "inviteeId": "uuid",
    "email": null,
    "message": "Join our awesome team!",
    "status": "PENDING",
    "expiresAt": "2025-10-25T10:00:00Z",
    "createdAt": "2025-10-18T10:00:00Z",
    "team": {
      "id": "uuid",
      "name": "Awesome Team",
      "avatar": "url"
    },
    "inviter": {
      "id": "uuid",
      "username": "john_doe",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

---

### 2. Get Team Invitations
Get all invitations for a team.

**Endpoint:** `GET /teams/:teamId/invitations?status=PENDING&page=1&limit=20`

**Auth:** Required (any team member)

**Query Parameters:**
- `status`: Optional - Filter by PENDING, ACCEPTED, DECLINED, EXPIRED
- `page`: Optional - Page number (default: 1)
- `limit`: Optional - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "invitations": [
      {
        "id": "uuid",
        "invitee": {
          "username": "jane_doe",
          "firstName": "Jane",
          "lastName": "Doe",
          "avatar": "url"
        },
        "inviter": {
          "username": "john_doe",
          "firstName": "John"
        },
        "status": "PENDING",
        "message": "Join us!",
        "createdAt": "2025-10-18T10:00:00Z",
        "expiresAt": "2025-10-25T10:00:00Z"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

### 3. Get User Invitations
Get all invitations for the authenticated user.

**Endpoint:** `GET /users/me/invitations?status=PENDING&page=1&limit=20`

**Auth:** Required

**Query Parameters:** Same as Get Team Invitations

**Response:**
```json
{
  "success": true,
  "data": {
    "invitations": [
      {
        "id": "uuid",
        "team": {
          "id": "uuid",
          "name": "Awesome Team",
          "avatar": "url",
          "description": "A great team"
        },
        "inviter": {
          "username": "john_doe",
          "firstName": "John",
          "lastName": "Doe"
        },
        "status": "PENDING",
        "message": "Join us!",
        "createdAt": "2025-10-18T10:00:00Z",
        "expiresAt": "2025-10-25T10:00:00Z"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

### 4. Accept Invitation
Accept an invitation to join a team.

**Endpoint:** `POST /invitations/:invitationId/accept`

**Auth:** Required (invitation recipient)

**Response:**
```json
{
  "success": true,
  "message": "Invitation accepted successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "teamId": "uuid",
    "status": "MEMBER",
    "joinedAt": "2025-10-18T10:00:00Z"
  }
}
```

---

### 5. Decline Invitation
Decline an invitation.

**Endpoint:** `POST /invitations/:invitationId/decline`

**Auth:** Required (invitation recipient)

**Response:**
```json
{
  "success": true,
  "message": "Invitation declined",
  "data": {
    "id": "uuid",
    "status": "DECLINED",
    "updatedAt": "2025-10-18T10:00:00Z"
  }
}
```

---

### 6. Cancel Invitation
Cancel an invitation (inviter or admin only).

**Endpoint:** `DELETE /invitations/:invitationId`

**Auth:** Required (inviter or team admin)

**Response:**
```json
{
  "success": true,
  "message": "Invitation cancelled successfully"
}
```

---

### 7. Resend Invitation
Resend an invitation (creates a new one).

**Endpoint:** `POST /invitations/:invitationId/resend`

**Auth:** Required (inviter or team admin)

**Response:**
```json
{
  "success": true,
  "message": "Invitation resent successfully",
  "data": {
    "id": "new-uuid",
    "status": "PENDING",
    "expiresAt": "2025-10-25T10:00:00Z",
    "createdAt": "2025-10-18T10:00:00Z"
  }
}
```

---

## 🚪 Team Join Requests API

### 1. Create Join Request
Request to join a public team.

**Endpoint:** `POST /teams/:teamId/join-requests`

**Auth:** Required

**Request Body:**
```json
{
  "message": "I'd love to join your team!"
}
```

**Validation:**
- `message`: Optional, max 500 characters
- Team must be public or allow join requests

**Response:**
```json
{
  "success": true,
  "message": "Join request sent successfully",
  "data": {
    "id": "uuid",
    "teamId": "uuid",
    "userId": "uuid",
    "message": "I'd love to join your team!",
    "status": "PENDING",
    "createdAt": "2025-10-18T10:00:00Z",
    "team": {
      "id": "uuid",
      "name": "Awesome Team",
      "avatar": "url",
      "visibility": "PUBLIC"
    },
    "user": {
      "id": "uuid",
      "username": "jane_doe",
      "firstName": "Jane",
      "lastName": "Doe",
      "avatar": "url",
      "bio": "Developer"
    }
  }
}
```

---

### 2. Get Team Join Requests
Get all join requests for a team (admin only).

**Endpoint:** `GET /teams/:teamId/join-requests?status=PENDING&page=1&limit=20`

**Auth:** Required (team admin)

**Query Parameters:**
- `status`: Optional - Filter by PENDING, ACCEPTED, DECLINED
- `page`: Optional - Page number (default: 1)
- `limit`: Optional - Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "username": "jane_doe",
          "firstName": "Jane",
          "lastName": "Doe",
          "avatar": "url",
          "bio": "Developer"
        },
        "message": "I'd love to join!",
        "status": "PENDING",
        "createdAt": "2025-10-18T10:00:00Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

### 3. Get User Join Requests
Get all join requests by the authenticated user.

**Endpoint:** `GET /users/me/join-requests?status=PENDING&page=1&limit=20`

**Auth:** Required

**Query Parameters:** Same as Get Team Join Requests

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "uuid",
        "team": {
          "id": "uuid",
          "name": "Awesome Team",
          "avatar": "url",
          "description": "A great team",
          "visibility": "PUBLIC"
        },
        "message": "I'd love to join!",
        "status": "PENDING",
        "createdAt": "2025-10-18T10:00:00Z"
      }
    ],
    "total": 2,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

### 4. Accept Join Request
Accept a join request (admin only).

**Endpoint:** `POST /join-requests/:requestId/accept`

**Auth:** Required (team admin)

**Response:**
```json
{
  "success": true,
  "message": "Join request accepted successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "teamId": "uuid",
    "status": "MEMBER",
    "joinedAt": "2025-10-18T10:00:00Z"
  }
}
```

---

### 5. Reject Join Request
Reject a join request (admin only).

**Endpoint:** `POST /join-requests/:requestId/reject`

**Auth:** Required (team admin)

**Response:**
```json
{
  "success": true,
  "message": "Join request rejected",
  "data": {
    "id": "uuid",
    "status": "DECLINED",
    "updatedAt": "2025-10-18T10:00:00Z"
  }
}
```

---

### 6. Cancel Join Request
Cancel your own join request.

**Endpoint:** `DELETE /join-requests/:requestId`

**Auth:** Required (request creator)

**Response:**
```json
{
  "success": true,
  "message": "Join request cancelled successfully"
}
```

---

### 7. Get Pending Requests Count
Get count of pending join requests for a team.

**Endpoint:** `GET /teams/:teamId/join-requests/count`

**Auth:** Required (any team member)

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 5
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common Error Codes:
- **400 Bad Request** - Invalid input data
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource (e.g., invitation already exists)
- **500 Internal Server Error** - Server error

---

## Testing with Postman

Import the existing `ProjectBuddy_Postman_Collection.json` and add these new endpoints.

**Example Request:**
```bash
curl -X POST http://localhost:5000/api/teams/team-id/roles \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Developer",
    "description": "Team developers",
    "color": "#3B82F6",
    "isAdmin": false
  }'
```

---

## Notes

1. **Admin Permissions**: A user is considered an admin if:
   - They have `status: 'ADMIN'` in TeamMember, OR
   - They have at least one custom role with `isAdmin: true`

2. **Invitation Expiry**: Invitations automatically expire after 7 days

3. **Public Teams**: Only public teams can receive join requests

4. **Duplicate Prevention**: System prevents duplicate invitations and join requests

5. **Pagination**: Default page size is 20, maximum is 100

6. **Role Names**: Must be unique within a team
