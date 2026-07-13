import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  )
}
