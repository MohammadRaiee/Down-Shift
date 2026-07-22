import PartForm from "@/components/parts/partform";
import { auth } from "@/auth";

interface PageProps {
  params: Promise<{ id: string }>;
}

const PartPage = async ({ params }: PageProps) => {

  const session = await auth();
// console.log("Session:", session?.user.id);

  const resolvedParams = await params;

  let part = null;

  try {
       const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    // console.log(baseUrl, "baseUrl");
    const res = await fetch(`${baseUrl}/api/parts/${resolvedParams.id}`);

    if (!res.ok) {
      console.error(`Failed to fetch part with ID ${resolvedParams.id}: ${res.statusText}`);
    } else {
      part = await res.json();
      // console.log('Part Data:', part);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }

  return (
    <div>
     <PartForm mode="edit" initialValues={part.data} partId={Number(resolvedParams.id)} publicherId={Number(session?.user.id)} />
    </div>
  );
};

export default PartPage;