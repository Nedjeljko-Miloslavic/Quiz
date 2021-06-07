const question_title = document.querySelector("#question_title");
const question_text = document.querySelector("#question_text");
const answers = document.querySelector("#answers");
const nav_bottom = document.querySelector("#nav-bottom");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const results = document.querySelector("#results");
const nav_side = document.querySelector("#nav-side");
const navigate_to_array = document.querySelectorAll(".navigate_to");
const main = document.querySelector("#main");
const incorrect = document.querySelectorAll(".incorrect");
const correct = document.querySelectorAll(".correct");
const results_breakdown = document.querySelector("#results_breakdown");
const close_results = document.querySelector("#close_results");
const start_new = document.querySelector("#start_new");
const alert_massage = document.querySelector("#alert_massage");

let current_slide = undefined;
let quiz_finished = false;

class Slide {
	constructor(slide_number, question_text, answers_array){
		this.slide_number = slide_number;
		this.question_text = question_text;
		this.answers_array = answers_array;
	}
}

const slides = [];
for(let i=0; i<4; i++){
	let slide = new Slide(i+1, random_question(), random_answers(i+1));
	slides.push(slide);
}

current_slide = slides[0];
deploy_slide();

navigate_to_array[0].classList.add("navigate_to_big");

navigate_to_array.forEach((navigate_to, index)=>{
	navigate_to.addEventListener("click", ()=>{
		if(current_slide.slide_number!=index+1){
			main.style.animation = "disappear_appear 0.5s forwards";
			setTimeout(()=>{
				main.style.animation = "none";
			},500);
		}
		current_slide = slides[index];
		navigate_to.classList.add("navigate_to_big");
		navigate_to_array.forEach((navigate_to, index_j)=>{
			if(index!=index_j){
				navigate_to.classList.remove("navigate_to_big");
			}
		});
		setTimeout(()=>{
			deploy_slide();
		},250);
		
	});
});


next.addEventListener("click", ()=>{
	current_slide = slides[current_slide.slide_number];
	main.style.animation="slide_up 0.5s forwards ease-in";
	setTimeout(()=>{
		deploy_slide();
	},250);
	animation_navigate_to_big();
	setTimeout(()=>{
		main.style.animation = "kk";
	},500);
});

previous.addEventListener("click", ()=>{
	current_slide = slides[current_slide.slide_number-2];
	main.style.animation="slide_down 0.5s forwards ease-in";
	setTimeout(()=>{
		deploy_slide();
	},250);
	animation_navigate_to_big();
	setTimeout(()=>{
		main.style.animation = "kk";
	},500);
});


results.addEventListener("click", ()=>{
	deploy_results();
});

close_results.addEventListener("click", ()=>{
	results_breakdown.style.visibility = "hidden";
});

start_new.addEventListener("click", ()=>{
	location.reload();
});




function random_question(){
	let random_value = Math.floor(Math.random()*40)+20;
	let question = String.fromCharCode(Math.floor(Math.random()*25)+65);
	for(let i=0; i<random_value; i++){
		let random_num = Math.floor(Math.random()*26);
		question += String.fromCharCode(random_num+97);
		if(random_num%5==0){
			question += " ";
		}
	}
	return question.trim()+"?";
}

function random_answers(slide_number){
	let array_length = slide_number + 2;
	let answers_array = [];
	for(let i=1; i<array_length+1; i++){
		answers_array.push(i);
	}
	return {
		answers:answers_array,
		correct_answer_index:Math.floor(Math.random()*array_length),
		picked_answer:undefined
	};
}

function deploy_slide(){
	question_title.innerHTML = "Question " + current_slide.slide_number + ": ";
	question_text.innerHTML = current_slide.question_text;

	answers.innerHTML = "";
	current_slide.answers_array.answers.forEach((answer,index)=>{
		let new_answer = document.createElement("div");
		new_answer.innerHTML = answer;
		new_answer.classList.add("answer");
		if(current_slide.answers_array.correct_answer_index == index && current_slide.answers_array.picked_answer !=undefined){
			new_answer.classList.add("correct_answer");
		}
		if(current_slide.answers_array.picked_answer == index){
			new_answer.classList.add("picked_answer");
		}
		answers.appendChild(new_answer);
	});
	
	if(current_slide.slide_number!=1){
		previous.style.visibility = "visible";
	}else{
		previous.style.visibility = "hidden";
	}
	if(current_slide.slide_number!=4){
		next.style.visibility = "visible";
	}else{
		next.style.visibility = "hidden";
	}
	if(quiz_finished){
		results.innerHTML = "Show results";
	}
	pick_the_answer();
}



function pick_the_answer(){
	const answer_array = document.querySelectorAll(".answer");
	answer_array.forEach((answer, index)=>{
		answer.addEventListener("click", ()=>{
			if(current_slide.answers_array.picked_answer == undefined){
				navigate_to_array[current_slide.slide_number-1].style.background = "#800000";
				current_slide.answers_array.picked_answer = index;
				answer.classList.add("picked_answer");
				answer_array.forEach((answer,index)=>{
					if(current_slide.answers_array.correct_answer_index == index){
						answer.classList.add("correct_answer");
					}
				});
			}else{
				alert_massage.style.visibility = "visible";
				setTimeout(()=>{
					alert_massage.style.visibility = "hidden";
				},3000);
			}
			show_results();
		});
		
	});
	
}

function check_answers(){
	const answers_all = [];
	slides.forEach((slide,index)=>{
		answers_all.push({
			slide_number:index+1,
			picked_answer:slide.answers_array.picked_answer,
			correct_answer:slide.answers_array.correct_answer_index
		});
	});
	return answers_all;
}


function animation_navigate_to_big(){
	navigate_to_array.forEach((navigate_to,index)=>{
		navigate_to.classList.remove("navigate_to_big");
		if(current_slide.slide_number-1==index){
			navigate_to.classList.add("navigate_to_big");
		}
	});
}

function show_results (){
	let undefined_answers = check_answers().filter((answer)=>{
		return answer.picked_answer==undefined;
	});
	if(undefined_answers.length==0){
		results.style.visibility = "visible";
	}
}

function deploy_results(){
	console.log(check_answers());
	check_answers().forEach((answer, index)=>{
		if(answer.picked_answer==answer.correct_answer){
			correct[index].style.display = "inline";
		}else{
			incorrect[index].style.display = "inline";
		}
	});
	results_breakdown.style.visibility = "visible";
}


