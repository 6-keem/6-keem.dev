import { Metadata } from 'next';
import { getCareerProjectList, getSortedProjectList } from '@/lib/project';
import { DATAS, Locale } from '@/config/types';
import LanguageSelector from '@/components/about/language-selector';
import ProjectList from '@/components/about/project-list';
import CopyLinkButton from '@/components/common/CopyLinkButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GlobeIcon, MailIcon } from 'lucide-react';
import * as D from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Section } from '@/components/ui/section';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectBody } from '@/components/project-detail/project-body';
import ReactMarkdown from 'react-markdown';

type Props = Promise<{ locale: Locale }>;

export function generateStaticParams() {
  return (Object.keys(DATAS) as Locale[]).map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Props }): Promise<Metadata> {
  const { locale } = await params;
  const data = DATAS[locale].data;
  return {
    title: `${data.name} | ${data.about}`,
    description: data.summary,
  };
}
export default async function AboutPage({ params }: { params: Props }) {
  const { locale } = await params;
  const RESUME_DATA = DATAS[locale].data;

  // Async data fetching directly inside the component
  const projectList = await getSortedProjectList(locale);
  const careerProjectList = await getCareerProjectList(locale);

  return (
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-6 sm:p-9 md:p-16 print:p-12 print:pt-0">
      <LanguageSelector className="m-auto mb-5 border-0 sm:hidden print:hidden" />
      <Section className="mx-auto w-full max-w-4xl space-y-16 print:space-y-4">
        <div className="flex flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <div className="flex-1 space-y-1.5 text-center sm:text-start">
            <h1 className="mb-4 text-5xl font-bold">{RESUME_DATA.about}</h1>
            <p className="max-w-md text-2xl text-pretty text-muted-foreground print:text-[12px]">{RESUME_DATA.name}</p>
            <p className="max-w-md items-center text-pretty text-sm text-muted-foreground">
              <a
                className="inline-flex items-center gap-x-1.5 align-baseline leading-none hover:underline"
                href={RESUME_DATA.locationLink}
                target="_blank"
              >
                <GlobeIcon className="size-3" />
                {RESUME_DATA.location}
              </a>
            </p>
            <div className="flex justify-center items-center gap-1.5 pt-1 m-0 text-sm text-muted-foreground sm:justify-start print:hidden">
              <a href="/" target="_blank" className="font-semibold">
                <span className="bg-blue-700 text-white p-0 w-full px-1 pl-1.5 py-1.5 rounded-l-md">RESUME</span>
                <span className="bg-amber-300 text-black p-0 w-full px-1 pr-1.5 py-1.5 rounded-r-md">CV</span>
              </a>
              {RESUME_DATA.contact.social.map((social) => (
                <Button key={social.name} className="size-8 shadow-none" variant="outline" size="icon" asChild>
                  <a href={social.url} target="_blank">
                    <social.icon className="size-4" />
                  </a>
                </Button>
              ))}
              {RESUME_DATA.contact.email && (
                <D.Dialog>
                  <D.DialogTrigger>
                    <Button className="size-8 shadow-none p-2" variant="outline" size="icon" asChild>
                      <MailIcon className="size-4" />
                    </Button>
                  </D.DialogTrigger>
                  <D.DialogContent className="max-w-[300px]">
                    <D.DialogHeader>
                      <D.DialogTitle className="p-0">Email Address</D.DialogTitle>
                      <D.DialogDescription></D.DialogDescription>
                    </D.DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <label htmlFor="link" className="sr-only">
                          Link
                        </label>
                        <Input id="link" defaultValue={RESUME_DATA.contact.email} readOnly />
                      </div>
                      <CopyLinkButton variant="default" url={RESUME_DATA.contact.email} className="p-3" />
                    </div>
                  </D.DialogContent>
                </D.Dialog>
              )}
            </div>
            <div className="hidden flex-col gap-x-1 text-sm text-muted-foreground print:flex print:text-[12px]">
              {RESUME_DATA.contact.email && (
                <a href={`mailto:${RESUME_DATA.contact.email}`}>
                  <span className="underline">{RESUME_DATA.contact.email}</span>
                </a>
              )}
            </div>
          </div>

          <Avatar className="size-28">
            <AvatarImage alt={RESUME_DATA.name} src={RESUME_DATA.avatarUrl} />
            <AvatarFallback>{RESUME_DATA.initials}</AvatarFallback>
          </Avatar>
        </div>
        <Section>
          <div className="flex mx-auto">
            <Badge
              variant={'outline'}
              className="py-1.5 mb-4 px-4 text-sm rounded-full bg-zinc-100 border-zinc-300 text-zinc-600 dark:text-white dark:bg-zinc-900 dark:border-zinc-700"
            >
              about me
            </Badge>
          </div>
          <div
            className={cn(
              'mx-auto flex text-center text-pretty leading-8 text-muted-foreground print:text-[12px]',
              DATAS[locale].aboutClassName
            )}
          >
            <ReactMarkdown
              components={{
                strong: ({ node, ...props }) => <strong className="text-zinc-700 dark:text-zinc-200" {...props} />,
              }}
            >
              {RESUME_DATA.summary}
            </ReactMarkdown>
          </div>
        </Section>
        <Section>
          <div className="flex">
            <Badge
              variant={'outline'}
              className="py-1.5 px-4 mb-4 text-sm rounded-full bg-zinc-100 border-zinc-300 text-zinc-600 dark:text-white dark:bg-zinc-900 dark:border-zinc-700"
            >
              Work Experience
            </Badge>
          </div>
          <div className="space-y-4">
            {RESUME_DATA.work.map((work) => (
              <Card key={work.company} className="rounded-lg border p-6 text-card-foreground shadow-none">
                <CardHeader className="mb-3 p-0">
                  <div className="flex flex-col items-start justify-between gap-1 gap-x-2 text-base sm:flex-row sm:items-center">
                    <h3 className="inline-flex items-center justify-center gap-x-1 text-lg font-semibold leading-none">
                      <a className="hover:underline" href={work.link} target="_blank">
                        {work.company}
                      </a>
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {work.start} - {work.end ?? 'Present'}
                    </div>
                  </div>
                </CardHeader>
                <CardDescription className="text-pretty text-sm">{work.description}</CardDescription>

                <h4 className="mt-7 font-semibold  leading-none print:text-[12px]">{work.title}</h4>
                {work.points && (
                  <ul className="mt-4 list-disc space-y-2 text-sm">
                    {work.points.map((point, index) => {
                      if (typeof point === 'string') {
                        return (
                          <li key={index} className="ml-5 text-muted-foreground">
                            {point}
                          </li>
                        );
                      } else {
                        const project = careerProjectList.find((p) => p.slug === point.slug);
                        if (!project)
                          return (
                            <li key={index} className="ml-5 text-muted-foreground">
                              {point.title}
                            </li>
                          );
                        return (
                          <D.Dialog key={point.slug}>
                            <li className="ml-5 text-muted-foreground">
                              <D.DialogTrigger className="underline underline-offset-4 hover:text-pink-600">{point.title}</D.DialogTrigger>
                            </li>
                            <D.DialogContent className="gap-0 px-0 pb-3">
                              <D.DialogTitle className="text-center text-xl">{point.title}</D.DialogTitle>
                              <div className="mt-1 text-center text-sm text-gray-500">
                                {project.startMonthString} - {project.endMonthString}
                              </div>
                              <div className="mt-2 max-h-[60vh] overflow-y-scroll sm:max-h-[70vh]">
                                <ProjectBody project={project} />
                              </div>
                              <D.DialogDescription className="sr-only"></D.DialogDescription>
                            </D.DialogContent>
                          </D.Dialog>
                        );
                      }
                    })}
                  </ul>
                )}
              </Card>
            ))}
          </div>
        </Section>
        <Section>
          <div className="flex">
            <Badge
              variant={'outline'}
              className="py-1.5 px-4 mb-4 text-sm rounded-full bg-zinc-100 border-zinc-300 text-zinc-600 dark:text-white dark:bg-zinc-900 dark:border-zinc-700"
            >
              Education
            </Badge>
          </div>
          <div className="space-y-3">
            {RESUME_DATA.education.map((education) => (
              <Card key={education.school} className="shadow-none rounded-lg">
                <CardHeader className="pb-0">
                  <div className="flex flex-col items-start justify-between gap-1 gap-x-2 text-base sm:flex-row sm:items-center">
                    <h3 className="text-lg font-semibold leading-none">{education.school}</h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {education.start} - {education.end}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-pretty text-muted-foreground mt-2 text-base print:text-[12px]">{education.degree}</CardContent>
              </Card>
            ))}
          </div>
        </Section>
        <Section>
          <div className="flex mx-auto">
            <Badge
              variant={'outline'}
              className="py-1.5 px-4 mb-4 text-sm rounded-full bg-zinc-100 border-zinc-300 text-zinc-600 dark:text-white dark:bg-zinc-900 dark:border-zinc-700"
            >
              Tech Stack
            </Badge>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex m-auto gap-1">
              <img alt="Static Badge" src="https://img.shields.io/badge/Flutter-02569B?style=flat&logo=Flutter&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black" />
              <img alt="Static Badge" src="https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/Redux-764ABC?style=flat&logo=redux&logoColor=white" />
            </div>
            <div className="flex m-auto gap-1">
              <img alt="Static Badge" src="https://img.shields.io/badge/Spring Boot-6DB33F?style=flat&logo=springboot&logoColor=white" />
              <img
                alt="Static Badge"
                src="https://img.shields.io/badge/Spring Security-6DB33F?style=flat&logo=springsecurity&logoColor=white"
              />
              <img alt="Static Badge" src="https://img.shields.io/badge/FastAPI-009688?style=plastic&logo=fastapi&logoColor=ffffff" />
              <img alt="Static Badge" src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" />
            </div>
            <div className="flex m-auto gap-1">
              <img alt="Static Badge" src="https://img.shields.io/badge/MYSQL-4479A1?style=flat&logo=mysql&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/mariadb-003545?style=flat&logo=mariadb&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/Redis-FF4438?style=flat&logo=redis&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/Firebase-DD2C00?style=flat&logo=firebase&logoColor=white" />
            </div>
            <div className="flex m-auto gap-1">
              <img alt="Static Badge" src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/Jenkins-D24939?style=flat&logo=Jenkins&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/Confluence-172B4D?style=flat&logo=confluence&logoColor=white" />
              <img alt="Static Badge" src="https://img.shields.io/badge/JIRA-0052CC?style=flat&logo=jira&logoColor=white" />
            </div>
          </div>
        </Section>

        <Section className="print-force-new-page scroll-mb-16">
          <div className="flex mx-auto">
            <Badge
              variant={'outline'}
              className="py-1.5 px-4 mb-4 text-sm rounded-full bg-zinc-100 border-zinc-300 text-zinc-600 dark:text-white dark:bg-zinc-900 dark:border-zinc-700"
            >
              Project
            </Badge>
          </div>
          <ProjectList list={projectList} />
        </Section>
      </Section>
    </main>
  );
}
