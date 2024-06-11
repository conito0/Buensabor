import { Auth0Provider } from "@auth0/auth0-react";

type Props = {
    children: JSX.Element;
};

export const Auth0ProviderWithNavigate = ({ children }: Props) => {
    return (
        <Auth0Provider
            domain="dev-txo0jpb5hw80bylr.us.auth0.com"
            clientId="MoOscA1VTuRLgEhcLpxbZi4FkGAxcqd5"
            authorizationParams={{
                redirect_uri: 'https://dashboard-front-five.vercel.app/carrito/1',
                audience: 'https://buensaborgrupal.com',
                scope: 'openid profile email'
            }}
        >
            {children}
        </Auth0Provider>
    );
};