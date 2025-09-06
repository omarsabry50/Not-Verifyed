class apiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery
        this.queryString = queryString
    }

    pagination() {
        let page = this.queryString.page
        if (page < 1) page = 1
        let limit = 2
        let skip = (page - 1) * limit

        this.mongooseQuery.find().skip((page || 1) * 2 - 2).limit(2)

        return this
    }

    filter() {
        let data = ['page', 'sort', 'search', 'select']
        let filterdQuery = { ...this.queryString }
        data.forEach(el => delete filterdQuery[el])
        filterdQuery = JSON.parse(JSON.stringify(filterdQuery).replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`))

        this.mongooseQuery.find(filterdQuery)
        return this

    }

    sort() {
        if (this.queryString.sort) {
            this.mongooseQuery.sort(this.queryString.sort.replaceAll(",", " "))
        }

        return this
    }

    select() {
        if (this.queryString.fields) {
            this.mongooseQuery.select(this.queryString.fields.replaceAll(",", " "))
        }

        return this
    }

    search() {

        if (this.queryString.search) {
            this.mongooseQuery.find({ $or: [{ title: { $regex: this.queryString.search, $options: "i" } }, { descreption: { $regex: this.queryString.search, $options: "i" } }] })
        }
        return this
    }

    


}

export default apiFeatures