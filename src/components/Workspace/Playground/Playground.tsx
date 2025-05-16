import React, { useEffect, useState } from 'react'
import PlaygroundNavbar from '@/components/Header/PlaygroundNavbar';
import Split from 'react-split';
import CodeMirror from "@uiw/react-codemirror";
import { python } from '@codemirror/lang-python';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Problem, Users } from '@/helpers/type'
import UserConsole from '@/components/Workspace/Playground/console/consoleRunner';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

type props = {
  user: Users,
  problems: [Problem],
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

const Playground = ({ user, problems, setSuccess }: props) => {
  const params = useParams<any>();
  const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
  const [clickedProblemsId, setClickedProblemId] = useState<string>();
  const [clickedProblems, setClickedProblems] = useState<Problem>();
  const [userCode, setUserCode] = useState<string>();
  const [output, setOutput] = useState<string | null>(null);

  useEffect(() => {
    if (problems) {
      problems.forEach((problem: any, index) => {
        if (problem.id === params.id) {
          setClickedProblems(problem);
          setClickedProblemId(problem._id);
        }
      })
    }
  }, [problems , params.id])

  useEffect(() => {
    const code = localStorage.getItem(`code -${clickedProblems?.id}`);
    if (code === '""' || code === null) {
      setUserCode(clickedProblems?.starterCode)
    } else {
      setUserCode(JSON.parse(code))
    }
  }, [clickedProblems?.id ,  clickedProblems?.starterCode])

  const handleCodeChange = (value: string) => {
    setUserCode(value);
  }

  const handleRun = async () => {
    try {
      localStorage.setItem(`code -${clickedProblems?.id}`, JSON.stringify(userCode));
      const res = await axios.post("../../../api/languages/python/run", {
        code: JSON.parse(JSON.stringify(userCode)),
      });

      if (res.data.success === true) {
        setOutput(`Output :  ${res.data.data}`);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "light"
        });
      } else {
        setOutput(`Error: ${res.data.error}`);
        toast.error(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark"
        });
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  }

  const handleSubmit = async () => {
    try {
      const ids = user?.problemList.map((prob: any) => prob?._id);
      const foundIndex = ids.indexOf(clickedProblemsId);

      const res = await axios.post("../../../api/languages/python/submit", {
        user: user,
        index: foundIndex,
        code: JSON.parse(JSON.stringify(userCode)),
        problem: clickedProblems
      });

      if (res.data.success === true) {
        setSuccess(true);
        setOutput(`Output :  ${res.data.data}`);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "light"
        });

      } else {
        setOutput(`Error: ${res.data.error}`);
        toast.error(res.data.message, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark"
        });
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='flex flex-col h-screen  bg-gray-800'>
      <PlaygroundNavbar />
      
      {/* Main content area with Split */}
      <div className='flex-1 overflow-hidden'>
        <Split className="h-full" direction="vertical" sizes={[60, 40]} minSize={150}>
          {/* Code Editor */}
          <div className='w-full h-full overflow-auto bg-zinc-900'>
            <CodeMirror
              value={userCode}
              theme={vscodeDark}
              onChange={handleCodeChange}
              extensions={[python()]}
              style={{ fontSize: "16px" }}
            />
          </div>

          {/* Testcase section */}
          <div className='w-full h-full px-5 overflow-auto bg-gray-800'>
            <div className='flex h-10 items-center space-x-6'>
              <div className='relative flex h-full flex-col justify-center cursor-pointer'>
                <div className='text-sm font-medium leading-5 text-white'>Testcases</div>
                <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' />
              </div>
            </div>
            <div className='flex'>
              {clickedProblems?.examples.map((example, index) => (
                <div
                  className='mr-2 items-start mt-2'
                  key={example.id}
                  onClick={() => setActiveTestCaseId(index)}
                >
                  <div className='flex flex-wrap items-center gap-y-4'>
                    <div className={`font-medium items-center transition-all focus:outline-none inline-flex bg-slate-800 hover:bg-slate-500 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap text-white`}>
                      Case {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='font-semibold my-4'>
              <p className='text-sm font-medium mt-4 text-white'>Input:</p>
              <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-gray-600 border-transparent text-white mt-2'>
                {clickedProblems?.examples[activeTestCaseId].inputText}
              </div>
              <p className='text-sm font-medium mt-4 text-white'>Output:</p>
              <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-gray-600 border-transparent text-white mt-2'>
                {clickedProblems?.examples[activeTestCaseId].outputText}
              </div>
            </div>
          </div>
        </Split>
      </div>

      {/* Fixed bottom section */}
      <div className='sticky bottom-0 w-full bg-slate-700 border-t border-gray-600'>
      {/* Console buttons - always visible */}
      <div className='p-2'>
        <UserConsole handleRun={handleRun} handleSubmit={handleSubmit} output={output} />
      </div>
        
        {output && (
        <div className='max-h-[200px] overflow-y-auto px-4 pb-2 bg-gray-800'>
          <div className='w-full text-white text-sm whitespace-pre-wrap p-3 rounded-lg bg-gray-700'>
            {output}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Playground