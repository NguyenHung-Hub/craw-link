import axios from "axios";
import * as cheerio from "cheerio";
import { useState } from "react";

function App() {
    const [url, setUrl] = useState("");
    const [links, setLinks] = useState([]);

    async function getHtml(url) {
        const { data: html } = await axios.get(url);

        return html;
    }

    function getLink(html) {
        let links = [];

        const $ = cheerio.load(html);
        $("a").each((index, item) => {
            links.push(item);
        });

        return links;
    }

    function hanldeGetLink() {
        const html = getHtml(url);
        const a_elements = getLink(html);

        const result = a_elements.reduce((acc, curr, index) => {
            if (curr?.attribs?.href && curr?.attribs?.title) {
                return [
                    ...acc,
                    { title: curr?.attribs?.title, href: curr?.attribs?.href },
                ];
            }

            return acc;
        }, []);

        setLinks(result);
    }

    return (
        <div className="wrapper">
            <input
                type="text"
                placeholder="Enter url"
                onChange={(e) => setUrl(e.target.value)}
                value={url}
            />

            <button onClick={hanldeGetLink}>Get</button>

            <ul>
                {links.length > 0 &&
                    links.map((link, index) => {
                        return (
                            <li key={index}>
                                <a href={link.href}>{link.title}</a>
                                <span>{link.href}</span>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}

export default App;
