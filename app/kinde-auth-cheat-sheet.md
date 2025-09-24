# Kinde Auth data - Server

You can get an authorized user’s Kinde Auth data from any server component using the `getKindeServerSession` helper.

| Method | Description |
|--------|-------------|
| `isAuthenticated` | Check if the user is authenticated |
| `getUser` | Get the current user's details |
| `getOrganization` | Get the current user's organization |
| `getUserOrganizations` | Get all the organizations the current user belongs to |
| `getPermission` | Check if the current user has a permission |
| `getPermissions` | Get the current user's permissions |
| `getFlag` | Get a feature flag |
| `getBooleanFlag` | Get a boolean feature flag |
| `getIntegerFlag` | Get an integer feature flag |
| `getStringFlag` | Get a string feature flag |
| `getAccessToken` | Get the decoded access token |
| `getAccessTokenRaw` | Get the access token |
| `getIdToken` | Get the decoded ID token |
| `getIdTokenRaw` | Get the ID token |
| `getClaim` | Get a claim from either token |


# Kinde Auth data - Client

You can get an authorized user’s Kinde Auth data from any client component using the `useKindeBrowser` helper.

| Variable / Method | Description |
|-------------------|-------------|
| `isAuthenticated` | Check if the user is authenticated |
| `user` / `getUser` | The current user's details |
| `organization` / `getOrganization` | The current user's organization |
| `userOrganizations` / `getUserOrganizations` | All the organizations the current user belongs to |
| `getPermission` | Check if the current user has a permission |
| `permissions` / `getPermissions` | The current user's permissions |
| `getFlag` | Get a feature flag |
| `getBooleanFlag` | Get a boolean feature flag |
| `getIntegerFlag` | Get an integer feature flag |
| `getStringFlag` | Get a string feature flag |
| `refreshData` | Refresh tokens to get up-to-date Kinde data |
| `accessToken` / `getAccessToken` | Get the decoded access token |
| `accessTokenRaw` / `getAccessTokenRaw` | Get the access token |
| `idToken` / `getIdToken` | Get the decoded ID token |
| `idTokenRaw` / `getIdTokenRaw` | Get the ID token |
| `isLoading` | Is Kinde data loading |
| `error` | Error message if there is an error |
