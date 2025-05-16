import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  AiOutlineLike,
  AiFillLike,
  AiOutlineDislike,
  AiFillDislike,
} from "react-icons/ai";
import { FaRegStar, FaStar } from "react-icons/fa";
import { TiInputChecked, TiStarOutline } from "react-icons/ti";
import { Problem, ProblemList, Users } from "@/helpers/type";
import axios from "axios";
import { ImCheckboxUnchecked } from "react-icons/im";
import { BsCheck2Circle } from "react-icons/bs";

type props = {
  user: Users;
  problems: [Problem];
};

const ProblemDescription = ({ user, problems }: props) => {
  const params = useParams<any>();
  const [clickedProblems, setClickedProblems] = useState<Problem>();
  const [clickedProblemsId, setClickedProblemId] = useState<string>();
  const [like, setLike] = useState<boolean>(false);
  const [disLike, setDisLike] = useState<boolean>(false);
  const [favorite, setFavorite] = useState<boolean>(false);
  const [difficultyColors, setDifficultyColor] = useState([
    {
      type: "Hard",
      textColor: "text-red-200",
      bgColor: "bg-red-500",
    },
    {
      type: "Medium",
      textColor: "text-orange-200",
      bgColor: "bg-orange-500",
    },
    {
      type: "Easy",
      textColor: "text-lime-200",
      bgColor: "bg-lime-500",
    },
  ]);

  // console.log(user)
  useEffect(() => {
    if (problems) {
      problems.forEach((problem: any, index) => {
        if (problem.id === params.id) {
          setClickedProblems(problem);
          setClickedProblemId(problem._id);
        }
      });
    }
  }, [problems , params.id]);

  useEffect(() => {
    const ids = (user?.problemList ?? []).map((prob: any) => prob?._id);
    const foundIndex = ids.indexOf(clickedProblemsId);

    if (foundIndex !== -1) {
      setLike(user.problemList[foundIndex].like);
      setDisLike(user.problemList[foundIndex].dislike);
      setFavorite(user.problemList[foundIndex].favorite);
    }
  }, [user, problems, clickedProblemsId]);

  const handelLikedproblems = async () => {
    const ids = user?.problemList.map((prob: any) => prob?._id);
    const foundIndex = ids.indexOf(clickedProblemsId);

    console.log(foundIndex);

    // Toggle the like state
    setLike((prevLike) => !prevLike);
    if (!like) {
      setDisLike(false);
    }

    try {
      const res = await axios.post("../../../api/handler/handelLikedproblems", {
        like: !like, // Sending the updated like state
        index: foundIndex,
        user: user,
      });

      //   console.log(res.data.message); // Assuming the server responds with some data
    } catch (error) {
      console.error("Error handling liked problems:", error);
    }
  };

  const handelDisLikedproblems = async () => {
    const ids = user?.problemList.map((prob: any) => prob?._id);
    const foundIndex = ids.indexOf(clickedProblemsId);

    console.log(foundIndex);

    // Toggle the like state
    setDisLike((prevDisLike) => !prevDisLike);
    if (!disLike) {
      setLike(false);
    }
    try {
      const res = await axios.post(
        "../../../api/handler/handelDisLikedproblems",
        {
          disLike: !disLike, // Sending the updated like state
          index: foundIndex,
          user: user,
        }
      );

      //   console.log(res.data.message); // Assuming the server responds with some data
    } catch (error) {
      console.error("Error handling liked problems:", error);
    }
  };

  const handelFavoritesproblems = async () => {
    const ids = user?.problemList.map((prob: any) => prob?._id);
    const foundIndex = ids.indexOf(clickedProblemsId);

    // console.log(foundIndex);

    setFavorite((prevFavorite) => !prevFavorite);

    try {
      const res = await axios.post(
        "../../../api/handler/handelFavoritesproblems",
        {
          favorite: !favorite,
          index: foundIndex,
          user: user,
        }
      );

      //   console.log(res.data.message); // Assuming the server responds with some data
    } catch (error) {
      console.error("Error handling liked problems:", error);
    }
  };

  return (
		<div className='bg-gray-800 h-[calc(100vh)]'> {/* Assuming navbar is 60px tall */}
			{/* TAB - Fixed at top */}
			<div className='flex h-11 w-full items-center pt-2 bg-gray-900 text-white overflow-x-hidden'>
				<div className={"bg-gray-800 rounded-t-[5px] px-5 py-[10px] text-xs cursor-pointer"}>
					Description
				</div>
			</div>

			{/* Scrollable content area */}
			<div className='h-[calc(100vh-60px-44px)] overflow-y-auto'> {/* Subtract navbar (60px) and tab (44px) heights */}
				<div className='px-5 py-4'>
					{/* Problem heading */}
					<div className='w-full'>
						<div className='flex space-x-4'>
							<div className='flex-1 mr-2 text-lg text-white font-medium'>1. Two Sum</div>
						</div>
						<div className='flex items-center mt-3'>
							<div
								className={`text-green-400 bg-olive inline-block rounded-[21px] bg-opacity-[.15] px-2.5 py-1 text-xs font-medium capitalize `}
							>
								Easy
							</div>
							<div className='rounded p-[3px] ml-4 text-lg transition-colors duration-200 text-green-s text-green-700'>
								<BsCheck2Circle />
							</div>
							<div className='flex items-center cursor-pointer hover:bg-black space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-gray-500'>
								<AiFillLike />
								<span className='text-xs'>120</span>
							</div>
							<div className='flex items-center cursor-pointer hover:bg-black space-x-1 rounded p-[3px]  ml-4 text-lg transition-colors duration-200 text-green-s text-gray-500'>
								<AiFillDislike />
								<span className='text-xs'>2</span>
							</div>
							<div className='cursor-pointer hover:bg-black  rounded p-[3px]  ml-4 text-xl transition-colors duration-200 text-green-s text-gray-500 '>
								<TiStarOutline />
							</div>
						</div>

						{/* Problem Statement(paragraphs) */}
						<div className='text-white text-sm'>
							<p className='mt-3'>
								Given an array of integers <code>nums</code> and an integer <code>target</code>, return
								<em>indices of the two numbers such that they add up to</em> <code>target</code>.
							</p>
							<p className='mt-3'>
								You may assume that each input would have <strong>exactly one solution</strong>, and you
								may not use thesame element twice.
							</p>
							<p className='mt-3'>You can return the answer in any order.</p>
						</div>

						{/* Examples */}
						<div className='mt-4'>
							{/* Example 1 */}
							<div>
								<p className='font-medium text-white '>Example 1: </p>
								<div className='example-card'>
									<pre>
										<strong className='text-white'>Input: </strong> nums = [2,7,11,15], target = 9{" "}
										<br />
										<strong>Output:</strong> [0,1] <br />
										<strong>Explanation:</strong>Because nums[0] + nums[1] == 9, we return [0, 1].
									</pre>
								</div>
							</div>

							{/* Example 2 */}
							<div>
								<p className='font-medium text-white '>Example 2: </p>
								<div className='example-card'>
									<pre>
										<strong className='text-white'>Input: </strong> nums = [3,2,4], target = 6{" "}
										<br />
										<strong>Output:</strong> [1,2] <br />
										<strong>Explanation:</strong>Because nums[1] + nums[2] == 6, we return [1, 2].
									</pre>
								</div>
							</div>
							{/* Example 3 */}
							<div>
								<p className='font-medium text-white '>Example 3: </p>
								<div className='example-card'>
									<pre>
										<strong className='text-white'>Input: </strong> nums = [3,3], target = 6
										<br />
										<strong>Output:</strong> [0,1] <br />
									</pre>
								</div>
							</div>
						</div>

						{/* Constraints */}
						<div className='my-5'>
							<div className='text-white text-sm font-medium'>Constraints:</div>
							<ul className='text-white ml-5 list-disc'>
								<li className='mt-2'>
									<code>2 ≤ nums.length ≤ 10</code>
								</li>

								<li className='mt-2'>
									<code>-10 ≤ nums[i] ≤ 10</code>
								</li>
								<li className='mt-2'>
									<code>-10 ≤ target ≤ 10</code>
								</li>
								<li className='mt-2 text-sm'>
									<strong>Only one valid answer exists.</strong>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProblemDescription;
