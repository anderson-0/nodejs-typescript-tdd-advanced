# Authentication using Facebook

> ## Data:
* Access Token

> ## Main Flow
1. Retrieve data from Facebook API (name, email, and Facebook ID)
2. Check if there is already an user with the email provided
3. Create an user account with data retrieved from Facebook
4. Generate an access token from the user ID that expires in 30 minutes
5. Return the access token

> ## Secondary Flow: User already exists in the database
3. Update the user account with data retrieved from Facebook (Facebook ID and name - should update only the name if the user account does not have one)

> ## Exception Flow: Invalid or Expired Token
1. Returns an authentication error
