
import { GetFormStats, GetForms } from "@/actions/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/CreateFormBtn";
import { Form } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { currentUser } from "@clerk/nextjs";
import { database, storage } from '../../components/firebase/firebaseConfig'

interface Submission {
  name: string;
  otherData: string;
  // Add other properties as needed
}

interface PastSubmission {
  name: string;
  school:string;
  date:string;
  index:string;

}

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Upload submission</h2>
      <Separator className="my-6" />
      <div className="grid gric-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">


      <StatsCard
        title="Total submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time form submissions"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />


    
    </div>
  );
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

async function FormCards() {

  const user= await currentUser();
  const firstname = user?.firstName?.toString()
  
console.log(firstname+'sdfsdf')
  const abhijeetData:PastSubmission []= [];
  try {
    const submissionsRef = database.ref('submissions');
    const snapshot = await submissionsRef.once('value');
    const schools: Record<string, Record<string, Record<string, Submission>>> = snapshot.val(); // Retrieve schools and submissions

    

    // Iterate over each school
    Object.keys(schools).forEach(schoolKey => {
      const school = schools[schoolKey];
      // Iterate over submissions under each school
      Object.keys(school).forEach(dateKey => {
        const submissions = school[dateKey];
        Object.keys(submissions).forEach(submissionKey => {
          const submission = submissions[submissionKey];
          // Check if submission has a 'name' property and if it's 'Abhijeet'
          if (submission && submission.name == firstname) {
            abhijeetData.push({
              school: schoolKey,
              date: dateKey,
              name:firstname,
              index:submissionKey
            });
           
          }
        });
      });
    });

    console.log("Data with name Abhijeet:");
    
  } catch (error) {
    console.error("Error retrieving data:", error);

  }

  const forms = await GetForms();
  return (
    <>
      {abhijeetData!!.map((form) => (
        <FormCard key={form.date} form={form} />
      ))}
    </>
  );
}

function FormCard({ form }: { form: PastSubmission }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <span className="truncate font-bold">{form.name}</span>
           <Badge>{form.date}</Badge>
        
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
         
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.school}
      </CardContent>
      <CardFooter>
        
          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form.school}/${form.date}/${form.index}/${form.name}`}>
              View submissions <BiRightArrowAlt />
            </Link>
          </Button>
        
      </CardFooter>
    </Card>
  );
}
