import Header from "@/app/ui/header/Header";
import Article from "@/app/ui/article/Article";
import Introduction from "@/app/ui/introduction/Introduction";
import Sponsor from "@/app/ui/sponser/sponsor";
import Footer from "@/app/ui/footer/Footer";


export default function Home() {
    return (
        <>
            <Article/>
            <Sponsor/>
            <Introduction/>
            <Footer/>
        </>

    );
}
