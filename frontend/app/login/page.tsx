import LogInCard from "@/components/auth/LoginCard";

const loginPage = () => {
  return (
    <div className="relative min-h-screen flex">
      <div className="max-w-3xl w-full mx-auto relative md:border-x">
        <div className="flex flex-col h-full">
          <div className="flex flex-grow xl:px-16 relative">
            <div className="w-full h-full text-border bg-[size:15px_15px] [background-image:repeating-linear-gradient(-315deg,currentColor_0_1px,#0000_0_50%)]" />
          </div>
          <div className="w-full border-y flex items-center justify-center">
            <LogInCard />
          </div>
          <div className="flex flex-grow xl:px-16 relative">
            <div className="w-full h-full text-border bg-[size:15px_15px] [background-image:repeating-linear-gradient(-315deg,currentColor_0_1px,#0000_0_50%)]" />
          </div>
        </div>
        <div className="hidden xl:block absolute top-0 -left-0 w-16 h-full border border-l-0 text-border bg-[size:15px_15px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
        <div className="hidden xl:block absolute top-0 -right-0 w-16 h-full border border-r-0 text-border bg-[size:15px_15px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      </div>
    </div>
  );
};

export default loginPage;
