import React, { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { getQuoteData } from "../../helpers/utils";

const Motd = () => {
    const { authState } = useOktaAuth();
    const [message, setMessage] = useState(null);
    const [author, setAuthor] = useState(null);
    const [sentinel] = useState(0); // used to avoid infinite loop in useEffect

    useEffect(() => {
        const quoteData = async () => {
            const quoteResp = await getQuoteData(authState.accessToken);

            if (quoteResp.statusCode === 200) {
                setMessage(quoteResp.data.quote);
                setAuthor(quoteResp.data.author);
            } else {
                setMessage("No quote available at this time...");
                setAuthor(null);
            }
        };
        quoteData();
    }, [authState, sentinel]);

    return (
        <div>
            <blockquote className="blockquote">
                <p className="mb-0"> {message} </p>{" "}
                <footer className="blockquote-footer"> {author} </footer>{" "}
            </blockquote>{" "}
        </div>
    );
};

export default Motd;
