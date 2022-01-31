import './EventDetail.css'

export default function RightDetail() {
    let now = new Date()
    let later = now
    later.setDate(later.getDate() + 2)
    let Event = {
        title: "Title",
        description: `Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware. It is considered one of the Big Five companies in the American information technology industry, along with Amazon, Apple, Meta (Facebook) and Microsoft.[10]

        Google was founded on September 4, 1998, by Larry Page and Sergey Brin while they were Ph.D. students at Stanford University in California. Together they own about 14% of its publicly-listed shares and control 56% of the stockholder voting power through super-voting stock. The company went public via an initial public offering (IPO) in 2004. In 2015, Google was reorganized as a wholly-owned subsidiary of Alphabet Inc.. Google is Alphabet's largest subsidiary and is a holding company for Alphabet's Internet properties and interests. Sundar Pichai was appointed CEO of Google on October 24, 2015, replacing Larry Page, who became the CEO of Alphabet. On December 3, 2019, Pichai also became the CEO of Alphabet.[11]
        
        In 2021, the Alphabet Workers Union was founded, mainly composed of Google employees.[12]
        
        The company's rapid growth since incorporation has included products, acquisitions, and partnerships beyond Google's core search engine, (Google Search). It offers services designed for work and productivity (Google Docs, Google Sheets, and Google Slides), email (Gmail), scheduling and time management (Google Calendar), cloud storage (Google Drive), instant messaging and video chat (Google Duo, Google Chat, and Google Meet), language translation (Google Translate), mapping and navigation (Google Maps, Waze, Google Earth, and Street View), podcast hosting (Google Podcasts), video sharing (YouTube), blog publishing (Blogger), note-taking (Google Keep and Jamboard), and photo organizing and editing (Google Photos). The company leads the development of the Android mobile operating system, the Google Chrome web browser, and Chrome OS (a lightweight, proprietary operating system based on the free and open-source Chromium OS operating system). Google has moved increasingly into hardware; from 2010 to 2015, it partnered with major electronics manufacturers in the production of its Google Nexus devices, and it released multiple hardware products in 2016, including the Google Pixel line of smartphones, Google Home smart speaker, Google Wifi mesh wireless router. Google has also experimented with becoming an Internet carrier (Google Fiber and Google Fi).
        
        Google.com is the most visited website worldwide. Several other Google-owned websites also are on the list of most popular websites, including YouTube and Blogger.[13] On the list of most valuable brands, Google is ranked second by Forbes[14] and fourth by Interbrand.[15] It has received significant criticism involving issues such as privacy concerns, tax avoidance, censorship, search neutrality, antitrust and abuse of its monopoly position.`,
        comments: "Comments Section",
        participants: "Participants List",
        createDate: now,
        startDate: later,
        city: "New York",
        country: "United States"
    }

    return (
        <div className="right-detail">












            <div className="right-card white">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
                        <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                    </svg>
                </div>
                <div>
                    {Event.startDate.toDateString()} <br/>  {Event.startDate.toLocaleTimeString()}
                </div>
            </div>















            <div className="address white right-card">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pin-angle" viewBox="0 0 16 16">
                        <path d="M9.828.722a.5.5 0 0 1 .354.146l4.95 4.95a.5.5 0 0 1 0 .707c-.48.48-1.072.588-1.503.588-.177 0-.335-.018-.46-.039l-3.134 3.134a5.927 5.927 0 0 1 .16 1.013c.046.702-.032 1.687-.72 2.375a.5.5 0 0 1-.707 0l-2.829-2.828-3.182 3.182c-.195.195-1.219.902-1.414.707-.195-.195.512-1.22.707-1.414l3.182-3.182-2.828-2.829a.5.5 0 0 1 0-.707c.688-.688 1.673-.767 2.375-.72a5.922 5.922 0 0 1 1.013.16l3.134-3.133a2.772 2.772 0 0 1-.04-.461c0-.43.108-1.022.589-1.503a.5.5 0 0 1 .353-.146zm.122 2.112v-.002.002zm0-.002v.002a.5.5 0 0 1-.122.51L6.293 6.878a.5.5 0 0 1-.511.12H5.78l-.014-.004a4.507 4.507 0 0 0-.288-.076 4.922 4.922 0 0 0-.765-.116c-.422-.028-.836.008-1.175.15l5.51 5.509c.141-.34.177-.753.149-1.175a4.924 4.924 0 0 0-.192-1.054l-.004-.013v-.001a.5.5 0 0 1 .12-.512l3.536-3.535a.5.5 0 0 1 .532-.115l.096.022c.087.017.208.034.344.034.114 0 .23-.011.343-.04L9.927 2.028c-.029.113-.04.23-.04.343a1.779 1.779 0 0 0 .062.46z"/>
                    </svg>
                </div>
                <div>
                    20 W 34th St, New York, NY 10001, United States<br/>
                    {Event.city} <br/> {Event.country}
                </div>
            </div>
        </div>
    )
}