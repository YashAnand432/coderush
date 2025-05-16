'use client'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AcountNavbar from '@/components/Header/AcountNavbar'
import { IoSearch } from "react-icons/io5";
import { AiOutlineSolution } from "react-icons/ai";
import { ImYoutube2 } from "react-icons/im";
import { ImCheckboxChecked, ImCheckboxUnchecked } from "react-icons/im";
import { useRouter } from 'next/navigation';
import { Users, ProblemList } from '@/helpers/type';

const Page = ({ params }: any) => {

    const router = useRouter();
    const [problems, setProblems] = useState([]);
    const [user, setUser] = useState<Users>();
    const [difficultyColors, setDifficultyColor] = useState([
        {
            type: 'Hard',
            color: 'text-red-500',
        },
        {
            type: 'Medium',
            color: 'text-orange-400',
        },
        {
            type: 'Easy',
            color: 'text-lime-400',
        },
    ]);

    const getData = async () => {
        try {
            const problemSet = await axios.get('../../api/utils/problemSets');
            setProblems(problemSet.data.data);
            

            const user = await axios.get('../../api/utils/verifiedUserDetails');
            setUser(user.data.user);

           

        } catch (error) {
            console.log(error);
        }

    }

    useEffect(() => {
        getData();
    }, [])

    return (
        <div>
            <AcountNavbar colour={"bg-gradient-to-r from-zinc-800 to-slate-800"} hoverColour={"white"} />

            <div className="p-0">
                <div className="relative overflow-x-auto shadow-md">
                    {/* Search bar remains the same */}
                    <div className="p-4 bg-white dark:bg-gray-900">
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <IoSearch color={'white'} />
                            </div>
                            <input type="text" id="table-search" className="block py-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search for items" />
                        </div>
                    </div>
                    
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4 w-[50px]">Status</th>
                                <th scope="col" className="px-6 py-3">Problem Title</th>
                                <th scope="col" className="px-6 py-3 w-[100px]">Difficulty</th>
                                <th scope="col" className="px-6 py-3 w-[150px]">Category</th>
                                <th scope="col" className="px-6 py-3 w-[100px] text-center">Solution</th>
                                <th scope="col" className="px-6 py-3 w-[120px] text-center">Video Solution</th>
                            </tr>
                        </thead>
                        <tbody>
                            {problems.map((problem: any, index) => (
                                <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    {/* Status Column */}
                                    <td className="p-4 w-[50px]">
                                        <div className="flex justify-center">
                                            {user?.problemList.map((userProblem: ProblemList, idx) => (
                                                userProblem._id === problem._id && (
                                                    userProblem.solved ? (
                                                        <ImCheckboxChecked key={idx} size={20} color={'green'}/>
                                                    ) : (
                                                        <ImCheckboxUnchecked key={idx} size={20} color={'green'}/>
                                                    )
                                                )
                                            ))}
                                        </div>
                                    </td>
                                    
                                    {/* Problem Title Column */}
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        <div 
                                            className="hover:text-cyan-400 hover:cursor-pointer" 
                                            onClick={() => router.push(`/accounts/problems/${problem.id}`)}
                                        >
                                            {problem.order}. {problem.title}
                                        </div>
                                    </th>
                                    
                                    {/* Difficulty Column */}
                                    <td className="px-6 py-4 w-[100px]">
                                        <div className={`hover:cursor-pointer ${
                                            problem.difficulty === 'Hard' ? 'text-red-500' :
                                            problem.difficulty === 'Medium' ? 'text-orange-400' :
                                            'text-lime-400'
                                        }`}>
                                            {problem.difficulty}
                                        </div>
                                    </td>
                                    
                                    {/* Category Column */}
                                    <td className="px-6 py-4 w-[150px]">
                                        {problem.category}
                                    </td>
                                    
                                    {/* Solution Column */}
                                    <td className="px-6 py-4 w-[100px]">
                                        <div className="flex justify-center">
                                            <AiOutlineSolution color={'white'} size={24} />
                                        </div>
                                    </td>
                                    
                                    {/* Video Solution Column */}
                                    <td className="px-6 py-4 w-[120px]">
                                        <div className="flex justify-center">
                                            <a href={`https://www.youtube.com/${problem.videoId}`}>
                                                <ImYoutube2 color={'red'} size={28} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Page;
