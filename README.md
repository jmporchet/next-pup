This is an application that allows to interact with the [Sari](https://www.vku-pgs.asa.ch/fr/) web portal.
It makes the workflow of adding new students to courses faster and more efficient.

# Parts in this project

There are two parts in this project. The first one is a front end application in that interacts with a backend which is powered by Next.js (this repository).  
The backend acts as a gateway to the second part, a [puppeteer interaction module](https://github.com/jmporchet/pup) that scrapes the Sari website.
It allows to list courses (both sensibilisation and motorbike courses), add people to the portal, search for them, and add them to a specific course.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
